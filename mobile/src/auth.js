//import jwt from 'jsonwebtoken';
import { storage } from './common';
import apolloClient from './graphql/client';
import LOGIN_MUTATION from './graphql/login.mutation';
import REGISTER_MUTATION from './graphql/register.mutation';

const USER_TOKEN = 'auth-token';

export const getAuthToken = () => {
    return new Promise((resolve, reject) => {
        storage.get(USER_TOKEN)
            .then(token => {
                if (!token) {
                    resolve(null);
                }
                const payload = JSON.parse(atob(token.split('.')[1]))
                resolve(payload);
            })
            .catch(err => reject(err));
    })
}

export const onSignIn = (identifier, password) => {
    return new Promise((resolve, reject) => {
        apolloClient.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
                emailOrUsername: identifier,
                password
            }
        }).then(({ data }) => {
            storage.set(USER_TOKEN, data.jwt)
                .then(res => resolve(res))
                .catch(err => reject(err));
        }).catch(err => {
            reject(err);
        });
    });
};

export const onSignUp = (email, username, password) => {
    return new Promise((resolve, reject) => {
        apolloClient.mutate({
            mutation: REGISTER_MUTATION,
            variables: { email, username, password }
        }).then(({ data }) => {
            storage.set(USER_TOKEN, data.jwt)
                .then(res => resolve(res))
                .catch(err => reject(err));
        }).catch(err => {
            reject(err);
        });
    });
};

export const onSignOut = () => {
    return storage.remove(USER_TOKEN);
};

export const isSignedIn = () => {
    return new Promise((resolve, reject) => {
        storage.get(USER_TOKEN)
            .then(res => {
                if (res !== null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};
