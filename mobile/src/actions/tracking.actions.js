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
import CURRENT_PARTICIPANT_QUERY from '../graphql/current-participant.query';

let watchId = null;

export const startTracking = () => dispatch => {
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
                        timestamp: position.coords.timestamp
                    }
                },
                update: (store, { data: { move } }) => {
                    const data = store.readQuery({ query: CURRENT_PARTICIPANT_QUERY });
                    data.currentParticipant.distance = move.distance;
                    data.currentParticipant.state = move.state;
                    store.writeQuery({
                        query: CURRENT_PARTICIPANT_QUERY,
                        data
                    });
                }
            }).catch(err => {
                console.log('> Move mutation error');
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
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000, distanceFilter: 0 },
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
