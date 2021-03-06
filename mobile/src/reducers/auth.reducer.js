import Immutable from 'seamless-immutable';
import { REHYDRATE } from 'redux-persist';
import { LOGOUT, SET_CURRENT_PARTICIPANT } from '../actions/constants';

const initialState = Immutable({
    loading: true
});

const auth = (state = initialState, action) => {
    switch (action.type) {
        case REHYDRATE:
            // convert persisted data to Immutable and confirm rehydration
            const { payload = { } } = action;
            return Immutable(payload.auth || state).set('loading', false);
        case SET_CURRENT_PARTICIPANT:
            return state.merge(action.participant);
        case LOGOUT:
            return Immutable({ loading: false });
        default:
            return state;
    }
};

export default auth;
