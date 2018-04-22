import Immutable from 'seamless-immutable';
import {
    START_TRACKING,
    STOP_TRACKING,
    TRACKING_ERROR,
    POSITION
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
        case TRACKING_ERROR:
            return Immutable.merge(state, { error: action.error });
        case POSITION:
            return Immutable.merge(state, { location: action.location });
        default:
            return state;
    }
};

export default tracking;
