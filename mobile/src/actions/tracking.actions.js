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
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0, distanceFilter: 0 },
    );
    return { type: START_TRACKING };
}

export const stopTracking = () => {
    navigator.geolocation.clearWatch(watchId);
    return { type: STOP_TRACKING };
}