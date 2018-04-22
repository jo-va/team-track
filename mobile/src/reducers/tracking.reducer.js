import Immutable from 'seamless-immutable';
import {
    START_TRACKING,
    STOP_TRACKING,
    TRACKING_ERROR,
    POSITION
} from '../actions/constants';

const defaultPosition = Immutable({
    latitude: null,
    longitude: null,
    altitude: null,
    speed: null,
    heading: null,
    accuracy: null,
    timestamp: null
});

const initialState = Immutable({
    isTracking: false,
    position: defaultPosition,
    error: null
});

const tracking = (state = initialState, action) => {
    switch (action.type) {
        case START_TRACKING:
            return Immutable.merge(state, { isTracking: true, error: null });
        case STOP_TRACKING:
            return Immutable.merge(state, { isTracking: false, error: null });
        case TRACKING_ERROR:
            return Immutable.merge(state, { error: action.error });
        case POSITION:
            const { position: { coords, timestamp } } = action;
            const position = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                altitude: coords.altitude,
                speed: coords.speed,
                heading: coords.heading,
                accuracy: coords.accuracy,
                timestamp: timestamp
            };
            return Immutable.merge(state, { position, error: null });
        default:
            return state;
    }
};

export default tracking;
