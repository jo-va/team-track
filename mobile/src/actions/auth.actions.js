import { client } from '../app';
import { LOGOUT, SET_CURRENT_PARTICIPANT } from './constants';

export const setCurrentParticipant = participant => ({
    type: SET_CURRENT_PARTICIPANT,
    participant
});

export const logout = () => {
    client.resetStore();
    return { type: LOGOUT };
}