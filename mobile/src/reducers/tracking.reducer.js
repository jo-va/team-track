import Immutable from 'seamless-immutable';
import {
    START_TRACKING,
    STOP_TRACKING,
    BACKGROUND_TRACKING,
    FOREGROUND_TRACKING,
    TRACKING_ERROR,
    AUTHORIZE_TRACKING,
    LOCATION,
    STATIONARY
} from '../actions/constants';

const initialState = Immutable({
    tracking: false,
    location: null,
    error: null
});

const tracking = (state = initialState, action) => {
    switch (action.type) {
        case START_TRACKING:
            return Immutable.merge(state, { tracking: true });
        case STOP_TRACKING:
            return Immutable.merge(state, { tracking: false });
        case BACKGROUND_TRACKING:
            return state;
        case FOREGROUND_TRACKING:
            return state;
        case TRACKING_ERROR:
            return Immutable.merge(state, { error: action.error });
        case AUTHORIZE_TRACKING:
            return state;
        case LOCATION:
            return Immutable.merge(state, { location: action.location });
        case STATIONARY:
            return Immutable.merge(state, { location: action.location });
        default:
            return state;
    }
};

export default tracking;
