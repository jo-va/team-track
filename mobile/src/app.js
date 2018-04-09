import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { storage } from './common';
import { isSignedIn } from './auth';
import { createRootNavigator } from './router';
import apolloClient from './graphql/client';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            signedIn: false,
            checkedSignIn: false
        };
    }

    componentDidMount() {
        isSignedIn()
            .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
            .catch(err => alert('An error occured'));
    }

    render() {
        const { checkedSignIn, signedIn } = this.state;

        if (!checkedSignIn) {
            return null;
        }

        const Layout = createRootNavigator(signedIn);

        return (
            <ApolloProvider client={apolloClient}>
                <Layout />
            </ApolloProvider>
        );
    }
}

export default App;
