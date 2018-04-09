import React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getAuthToken } from '../auth';

const httpLink = new HttpLink({
    uri: 'http://192.168.0.183:3000/graphql'
});

const authLink = setContext(async (req, { headers }) => {
    const token = await getAuthToken();
    const authorization =  token ? `Bearer ${token}` : null;

    return {
        headers: {
            ...headers,
            authorization
        }
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path}) => {
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
    }
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }
});

const client = new ApolloClient({
    link: ApolloLink.from([
        errorLink,
        authLink,
        httpLink
    ]),
    cache: new InMemoryCache()
});

export default client;
