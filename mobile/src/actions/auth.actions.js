import { client, store } from '../app';
import { LOGOUT, SET_CURRENT_PARTICIPANT } from './constants';
import { stopTracking } from './tracking.actions';

export const setCurrentParticipant = participant => ({
    type: SET_CURRENT_PARTICIPANT,
    participant
});

export const logout = () => {
    store.dispatch(stopTracking());
    client.resetStore();
    return { type: LOGOUT };
};
