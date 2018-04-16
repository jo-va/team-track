import React from 'react';
import { Alert } from 'react-native';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

const geolocationConfig = {
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 10,
    distanceFilter: 10,
    notificationTitle: 'Team Tracker',
    notificationText: 'Background tracking enabled',
    debug: true,
    startOnBoot: false,
    stopOnTerminate: true,
    locationProvider: BackgroundGeolocation.RAW_PROVIDER,
    interval: 1000,
    fastestInterval: 1000,
    activitiesInterval: 1000,
    stopOnStillActivity: false
};

export const hasTracking = WrappedComponent => {
    class HasTracking extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                region: null,
                isRunning: false,
                locations: [],
                stationaries: []
            };

            this.toggle = this.toggle.bind(this);
            this.start = this.start.bind(this);
            this.stop = this.stop.bind(this);
        }

        componentDidMount() {
            BackgroundGeolocation.configure(geolocationConfig);

            function logError(msg) {
                console.log(`[ERROR] getLocations: ${msg}`);
            }
          
            const handleHistoricLocations = locations => {
                let region = null;
                const now = Date.now();
                const latitudeDelta = 0.01;
                const longitudeDelta = 0.01;
                const durationOfDayInMillis = 24 * 3600 * 1000;
          
                const locationsPast24Hours = locations.filter(location => {
                    return now - location.time <= durationOfDayInMillis;
                });
          
                if (locationsPast24Hours.length > 0) {
                  // asume locations are already sorted
                    const lastLocation = locationsPast24Hours[locationsPast24Hours.length - 1];
                    region = { ...lastLocation, latitudeDelta, longitudeDelta };
                }
                this.setState({ locations: locationsPast24Hours, region });
            };
          
            BackgroundGeolocation.getValidLocations(
                handleHistoricLocations.bind(this),
                logError
            );

            BackgroundGeolocation.on('location', location => {
                console.log('[DEBUG] BackgroundGeolocation location', location);
                BackgroundGeolocation.startTask(taskKey => {
                    requestAnimationFrame(() => {
                        const longitudeDelta = 0.01;
                        const latitudeDelta = 0.01;
                        if (location.radius) {
                            const region = {...location, latitudeDelta, longitudeDelta };
                            const stationaries = this.state.stationaries.slice(0);
                            stationaries.push(location);
                            this.setState({ stationaries, region });
                        } else {
                            const region = {...location, latitudeDelta, longitudeDelta };
                            const locations = this.state.locations.slice(0);
                            locations.push(location);
                            this.setState({ locations, region });
                        }
                    });
                    BackgroundGeolocation.endTask(taskKey);
                });
            });

            BackgroundGeolocation.on('stationary', stationaryLocation => {

            });

            BackgroundGeolocation.on('error', ({ message }) => {
                console.log('[ERROR] BackgroundGeolocation error:', message);
                Alert.alert('BackgroundGeolocation error', message);
            });

            BackgroundGeolocation.on('authorization', status => {
                console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
                if (status !== BackgroundGeolocation.AUTHORIZED) {
                    setTimeout(() =>
                        Alert.alert(
                            'Location services are disabled',
                            'Would you like to open location settings?',
                            [
                                { text: 'Yes', onPress: () => BackgroundGeolocation.showLocationSettings() },
                                { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
                            ]
                        ), 1000);
                }
            });

            BackgroundGeolocation.on('background', () => {
                console.log('[INFO] App is in background');
            });

            BackgroundGeolocation.on('foreground', () => {
                console.log('[INFO] App is in foreground');
            });

            BackgroundGeolocation.on('start', () => {
                console.log('[INFO] BackgroundGeolocation service has been started');
                this.setState({ isRunning: true });
            });

            BackgroundGeolocation.on('stop', () => {
                console.log('[INFO] BackgroundGeolocation service has been stopped');
                this.setState({ isRunning: false });
            });            

            BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
                console.log('[INFO] BackgroundGeolocation service is running', isRunning);
                console.log('[INFO] BackgroundGeolocation services enabled', locationServicesEnabled);
                console.log('[INFO] BackgroundGeolocation auth status: ' + authorization);

                this.setState({ isRunning });
            });
        }

        componentWillUnmount() {
            BackgroundGeolocation.events.forEach(event =>
                BackgroundGeolocation.removeAllListeners(event)
            );
        }

        start() {
            BackgroundGeolocation.start();
        }

        stop() {
            BackgroundGeolocation.stop();
        }

        toggle() {
            BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
                if (isRunning) {
                    BackgroundGeolocation.stop();
                    return false;
                }

                if (!locationServicesEnabled) {
                    Alert.alert(
                        'Location services disabled',
                        'Would you like to open location settings?',
                        [
                            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
                            { text: 'No', onPress: () => console.log('No pressed'), style: 'cancel' }
                        ]
                    );
                    return false;
                }

                if (authorization === 99) {
                    BackgroundGeolocation.start();
                } else if (authorization == BackgroundGeolocation.AUTHORIZED) {
                    BackgroundGeolocation.start();
                } else {
                    Alert.alert(
                        'App requires location tracking',
                        'Please grant permission',
                        [
                            { text: 'Ok', onPress: () => BackgroundGeolocation.start() }
                        ]
                    );
                }
            });
        }

        render() {
            return (
                <WrappedComponent
                    {...this.state}
                    {...this.props}
                    toggleTracking={this.toggle}
                    startTracking={this.start}
                    stopTracking={this.stop}
                />
            );
        }
    }

    return HasTracking;
};

export default hasTracking;
