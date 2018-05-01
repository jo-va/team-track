import Immutable from 'seamless-immutable';
import { REHYDRATE } from 'redux-persist';
import { LOGOUT } from '../actions/constants';
import {
    START_TRACKING,
    STOP_TRACKING,
    TRACKING_ERROR,
    LOCATION
} from '../actions/constants';

const defaultLocation = Immutable({
    latitude: null,
    longitude: null,
    altitude: null,
    speed: null,
    heading: null,
    accuracy: null,
    timestamp: null
});

const INITIAL_STATE = Immutable({
    isTracking: false,
    location: defaultLocation,
    error: null
});

const tracking = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REHYDRATE:
            return state;
        case LOGOUT:
            return state;
        case START_TRACKING:
            return Immutable.merge(state, { isTracking: true, error: null });
        case STOP_TRACKING:
            return Immutable.merge(state, { isTracking: false, error: null });
        case TRACKING_ERROR:
            return Immutable.merge(state, { error: action.error });
        case LOCATION:
            const { location: { coords, timestamp } } = action;
            const location = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                altitude: coords.altitude,
                speed: coords.speed,
                heading: coords.heading,
                accuracy: coords.accuracy,
                timestamp: timestamp
            };
            return Immutable.merge(state, { location, error: null });
        default:
            return state;
    }
};

export default tracking;
