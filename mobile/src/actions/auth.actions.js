import { client } from '../app';
import { LOGOUT, SET_CURRENT_PARTICIPANT } from './constants';
import { stopGeolocation } from './tracking.actions';

export const setCurrentParticipant = participant => ({
    type: SET_CURRENT_PARTICIPANT,
    participant
});

export const logout = () => dispatch => {
    dispatch(stopGeolocation());

    // Timeout to fix `store reset while query was in flight` issue
    setTimeout(() => {
        client.resetStore();
        return dispatch({ type: LOGOUT });
    }, 1000);
};
