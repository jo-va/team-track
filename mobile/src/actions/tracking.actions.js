import { store } from '../app';
import { Toast } from 'native-base';
import { client } from '../app';
import {
    START_TRACKING,
    STOP_TRACKING,
    TRACKING_ERROR,
    POSITION
} from './constants';
import STEP_MUTATION from '../graphql/step.mutation';
import START_TRACKING_MUTATION from '../graphql/start-tracking.mutation';
import STOP_TRACKING_MUTATION from '../graphql/stop-tracking.mutation';
import CURRENT_PARTICIPANT_QUERY from '../graphql/current-participant.query';

const DISTANCE_FILTER = 5;

let watchId = null;

export const startTracking = () => dispatch => {
    client.mutate({
        mutation: START_TRACKING_MUTATION,
        update: (store, { data: { startTracking } }) => {
            const data = store.readQuery({ query: CURRENT_PARTICIPANT_QUERY });
            data.currentParticipant.distance = startTracking.distance;
            data.currentParticipant.state = startTracking.state;
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
        (position) => {
            client.mutate({
                mutation: STEP_MUTATION,
                variables: {
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        speed: position.coords.speed,
                        heading: position.coords.heading,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    }
                },
                update: (store, { data: { step } }) => {
                    const data = store.readQuery({ query: CURRENT_PARTICIPANT_QUERY });
                    data.currentParticipant.distance = step.distance;
                    data.currentParticipant.state = step.state;
                    store.writeQuery({
                        query: CURRENT_PARTICIPANT_QUERY,
                        data
                    });
                }
            }).catch(err => {
                console.log('> Step mutation error');
                console.log(err);
            });

            return dispatch({ type: POSITION, position });
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
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000, distanceFilter: DISTANCE_FILTER },
    );

    Toast.show({
        text: 'Tracking started',
        type: 'success',
        position: 'bottom'
    });

    return dispatch({ type: START_TRACKING });
};

export const stopTracking = () => {
    navigator.geolocation.clearWatch(watchId);
    navigator.geolocation.stopObserving();
    watchId = null;

    client.mutate({
        mutation: STOP_TRACKING_MUTATION,
        update: (store, { data: { stopTracking } }) => {
            const data = store.readQuery({ query: CURRENT_PARTICIPANT_QUERY });
            data.currentParticipant.distance = stopTracking.distance;
            data.currentParticipant.state = stopTracking.state;
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
