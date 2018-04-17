import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { store } from '../app';
import {
    START_TRACKING,
    STOP_TRACKING,
    BACKGROUND_TRACKING,
    FOREGROUND_TRACKING,
    TRACKING_ERROR,
    AUTHORIZE_TRACKING,
    LOCATION,
    STATIONARY
} from './constants';

const defaultConfig = {
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

export const initTracking = config => dispatch => {
    const geolocationConfig = { ...defaultConfig, ...config };
    BackgroundGeolocation.configure(geolocationConfig);

    BackgroundGeolocation.on('location', location => {
        console.log('[DEBUG] BackgroundGeolocation location', location);
        BackgroundGeolocation.startTask(taskKey => {
            dispatch({ type: LOCATION, location });
            BackgroundGeolocation.endTask(taskKey);
        });
    });

    BackgroundGeolocation.on('stationary', location => {
        console.log('[DEBUG] BackgroundGeolocation stationary', location);
        dispatch({ type: STATIONARY, location });
    });

    BackgroundGeolocation.on('error', (error) => {
        console.log('[ERROR] BackgroundGeolocation error:', error.message);
        dispatch({ type: TRACKING_ERROR, error });
        Alert.alert('BackgroundGeolocation error', error.message);
    });

    BackgroundGeolocation.on('authorization', status => {
        console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
        if (status !== BackgroundGeolocation.AUTHORIZED) {
            dispatch({ type: AUTHORIZE_TRACKING });
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
        dispatch({ type: BACKGROUND_TRACKING });
    });

    BackgroundGeolocation.on('foreground', () => {
        console.log('[INFO] App is in foreground');
        dispatch({ type: FOREGROUND_TRACKING });
    });

    BackgroundGeolocation.on('start', () => {
        console.log('[INFO] BackgroundGeolocation service has been started');
        dispatch({ type: START_TRACKING });
    });

    BackgroundGeolocation.on('stop', () => {
        console.log('[INFO] BackgroundGeolocation service has been stopped');
        dispatch({ type: STOP_TRACKING });
    });            

    BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
        console.log('[INFO] BackgroundGeolocation service is running', isRunning);
        console.log('[INFO] BackgroundGeolocation services enabled', locationServicesEnabled);
        console.log('[INFO] BackgroundGeolocation auth status: ' + authorization);

        if (isRunning) {
            dispatch({ type: START_TRACKING });
        }
    });    
};

export const finalizeTracking = () => {
    BackgroundGeolocation.events.forEach(event =>
        BackgroundGeolocation.removeAllListeners(event)
    );
};

export const startTracking = () => {
    BackgroundGeolocation.start();
};

export const stopTracking = () => {
    BackgroundGeolocation.stop();
};

export const toggleTracking = () => {
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
};