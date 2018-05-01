import { store } from '../app';
import { Toast } from 'native-base';
import { client } from '../app';
import {
    START_TRACKING,
    STOP_TRACKING,
    TRACKING_ERROR,
    LOCATION
} from './constants';
import ADD_LOCATION_MUTATION from '../graphql/add-location.mutation';
import START_TRACKING_MUTATION from '../graphql/start-tracking.mutation';
import STOP_TRACKING_MUTATION from '../graphql/stop-tracking.mutation';
import CURRENT_PARTICIPANT_QUERY from '../graphql/current-participant.query';

const DISTANCE_FILTER = 0;
const MAX_AGE = 2000;
const TIMEOUT = 5000;

let watchId = null;

// See this for a kalman filter:
// https://medium.com/@mizutori/make-it-even-better-than-nike-how-to-filter-locations-tracking-highly-accurate-location-in-1c9d53d31d93

function filterLocation(location) {
    if (!location || !location.coords) {
        return null;
    }

    if (location.coords.accuracy < 0) {
        return null;
    }

    if (location.coords.accuracy > 100) {
        return null;
    }

    const interval = Math.abs(Date.now() - location.timestamp);
    if (interval > MAX_AGE) {
        return null;
    }

    return location;
}

export const startTracking = () => dispatch => {
    client.mutate({
        mutation: START_TRACKING_MUTATION,
        update: (store, { data: { startTracking } }) => {
            const data = store.readQuery({ query: CURRENT_PARTICIPANT_QUERY });
            data.currentParticipant.distance = startTracking.distance;
            data.currentParticipant.isActive = startTracking.isActive;
            store.writeQuery({
                query: CURRENT_PARTICIPANT_QUERY,
                data
            });
        }
    }).catch(err => {
        console.log('> startTracking mutation error');
        console.log(err);
    });

    watchId = navigator.geolocation.watchPosition(
        (location) => {
            const filteredLocation = filterLocation(location);

            if (filteredLocation) {
                const { coords: { latitude, longitude, speed, heading, accuracy }, timestamp } = filteredLocation;

                client.mutate({
                    mutation: ADD_LOCATION_MUTATION,
                    variables: {
                        location: {
                            latitude, longitude, speed, heading, accuracy, timestamp
                        }
                    },
                    update: (store, { data: { addLocation } }) => {
                        const data = store.readQuery({ query: CURRENT_PARTICIPANT_QUERY });
                        data.currentParticipant.distance = addLocation.distance;
                        data.currentParticipant.isOutOfRange = addLocation.isOutOfRange;
                        store.writeQuery({
                            query: CURRENT_PARTICIPANT_QUERY,
                            data
                        });
                    }
                }).catch(err => {
                    console.log('> addLocation mutation error');
                    console.log(err);
                });

                return dispatch({ type: LOCATION, location });
            }
        },
        (error) => {
            Toast.show({
                text: `Tracking error: ${error.message}`,
                type: 'danger',
                duration: 10000,
                position: 'bottom'
            });

            return dispatch({ type: TRACKING_ERROR, error: error.message });
        },
        { enableHighAccuracy: true, timeout: TIMEOUT, maximumAge: MAX_AGE, distanceFilter: DISTANCE_FILTER },
    );

    Toast.show({
        text: 'Tracking started',
        type: 'success',
        position: 'bottom'
    });

    return dispatch({ type: START_TRACKING });
};

export const stopGeolocation = () => {
    navigator.geolocation.clearWatch(watchId);
    navigator.geolocation.stopObserving();
    watchId = null;

    return { type: STOP_TRACKING };
};

export const stopTracking = () => {
    stopGeolocation();

    client.mutate({
        mutation: STOP_TRACKING_MUTATION,
        update: (store, { data: { stopTracking } }) => {
            const data = store.readQuery({ query: CURRENT_PARTICIPANT_QUERY });
            data.currentParticipant.distance = stopTracking.distance;
            data.currentParticipant.isActive = stopTracking.isActive;
            store.writeQuery({
                query: CURRENT_PARTICIPANT_QUERY,
                data
            });
        }
    }).catch(err => {
        console.log('> stopTracking mutation error');
        console.log(err);
    });    

    Toast.show({
        text: 'Tracking stopped',
        type: 'success',
        position: 'bottom'
    });

    return { type: STOP_TRACKING };
};

export const toggleTracking = () => {
    if (watchId !== null) {
        return stopTracking();
    } else {
        return startTracking();
    }
};
