import { client } from '../app';
import { LOGOUT, SET_CURRENT_USER } from '../constants/constants';

export const setCurrentUser = user => ({
    type: SET_CURRENT_USER,
    user
});

export const logout = () => {
    client.resetStore();
    return { type: LOGOUT };
}