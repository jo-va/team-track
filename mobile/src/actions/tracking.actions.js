import { store } from '../app';
import {
    START_TRACKING,
    STOP_TRACKING,
    TRACKING_ERROR,
    POSITION
} from './constants';

let watchId = null;

export const startTracking = () => dispatch => {
    watchId = navigator.geolocation.watchPosition(
        (position) => dispatch({ type: POSITION, position }),
        (error) => dispatch({ type: TRACKING_ERROR, error: error.message }),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000, distanceFilter: 0 },
    );
    return dispatch({ type: START_TRACKING });
};

export const stopTracking = () => {
    navigator.geolocation.clearWatch(watchId);
    navigator.geolocation.stopObserving();
    watchId = null;
    return { type: STOP_TRACKING };
};

export const toggleTracking = () => {
    if (watchId !== null) {
        return stopTracking();
    } else {
        return startTracking();
    }
};
