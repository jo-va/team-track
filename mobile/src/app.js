import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from 'react-apollo';
import { composeWithDevTools } from 'redux-devtools-extension';
import { HttpLink } from 'apollo-link-http';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { ReduxCache, apolloReducer } from 'apollo-cache-redux';
import ReduxLink from 'apollo-link-redux';
import { onError } from 'apollo-link-error';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistStore, persistCombineReducers } from 'redux-persist';
import thunk from 'redux-thunk';
import AppWithNavigationState, {
    navigationReducer,
    navigationMiddleware
} from './navigation';
import auth from './reducers/auth.reducer';
import { logout } from './actions/auth.actions';

const URL = '192.168.0.183:3000';

const config = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['nav', 'apollo'] // don't persist nav for now
};

const reducer = persistCombineReducers(config, {
    apollo: apolloReducer,
    nav: navigationReducer,
    auth
});

const store = createStore(
    reducer,
    {}, // initial state
    composeWithDevTools(
        applyMiddleware(thunk, navigationMiddleware)
    )
);

const persistor = persistStore(store);

const cache = new ReduxCache({ store });

const reduxLink = new ReduxLink(store);

const httpLink = new HttpLink({
    uri: `http://${URL}/graphql`
});

const authLink = setContext((req, previousContext) => {
    const { jwt } = store.getState().auth;
    if (jwt) {
        return {
            headers: {
                authorization: `Bearer ${jwt}`
            }
        };
    }

    return previousContext;
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    let shouldLogout = false;
    if (graphQLErrors) {
        console.log({ graphQLErrors });
        graphQLErrors.forEach(({ message, locations, path }) => {1651
            console.log({ message, locations, path});
            if (message === 'Unauthorized') {
                shouldLogout = true;
            }
        });

        if (shouldLogout) {
            store.dispatch(logout());
        }
    }
    if (networkError) {
        console.log('[Network error]:');
        console.log({ networkError });
        if (networkError.statusCode === 401) {
            logout();
        }
    }
});

const link = ApolloLink.from([
    reduxLink,
    errorLink,
    authLink.concat(httpLink)
]);

export const client = new ApolloClient({
    link,
    cache
});

export default class App extends React.Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <PersistGate persistor={persistor}>
                        <AppWithNavigationState />
                    </PersistGate>
                </Provider>
            </ApolloProvider>
        );
    }
}
