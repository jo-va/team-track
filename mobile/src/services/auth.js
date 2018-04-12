//import jwt from 'jsonwebtoken';
import Storage from './storage';
import apolloClient from '../graphql/client';
import SIGNIN_MUTATION from '../graphql/signIn.mutation';
import SIGNUP_MUTATION from '../graphql/signUp.mutation';
import { Base64 } from '../utils';

const USER_TOKEN = 'auth-token';

export const getAuthToken = () => {
    return Storage.get(USER_TOKEN);
};

export const getUserToken = () => {
    return new Promise((resolve, reject) => {
        Storage.get(USER_TOKEN)
            .then(token => {
                if (!token) {
                    resolve(null);
                }
                const payload = JSON.parse(Base64.atob(token.split('.')[1]))
                resolve(payload);
            })
            .catch(err => reject(err));
    })
}

export const onSignIn = (identifier, password) => {
    return new Promise((resolve, reject) => {
        apolloClient.mutate({
            mutation: SIGNIN_MUTATION,
            variables: {
                emailOrUsername: identifier,
                password
            }
        }).then(({ data }) => {
            console.log(data);
            Storage.set(USER_TOKEN, data.signIn.jwt)
                .then(res => {
                    resolve(res);
                })
                .catch(err => reject(err));
        }).catch(err => {
            reject(err);
        });
    });
};

export const onSignUp = (email, username, password) => {
    return new Promise((resolve, reject) => {
        apolloClient.mutate({
            mutation: SIGNUP_MUTATION,
            variables: { email, username, password }
        }).then(({ data }) => {
            console.log(data);
            Storage.set(USER_TOKEN, data.signUp.jwt)
                .then(res => resolve(res))
                .catch(err => reject(err));
        }).catch(err => {
            reject(err);
        });
    });
};

export const onSignOut = () => {
    return Storage.remove(USER_TOKEN);
};
