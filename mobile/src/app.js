import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Actions } from 'react-native-router-flux';
import { getUserToken } from './services/auth';
import Router from './router';
import apolloClient from './graphql/client';
import { Spinner } from './components';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            canNavigate: false
        };
    }

    async componentDidMount() {
        try {
            const userToken = await getUserToken();
            console.log(userToken);
            if (userToken && userToken.group) {
                console.log('main');
                //Actions.reset('main');
            } else if (userToken) {
                console.log('main');
                //Actions.reset('enroll');
            }
            this.setState(prevState => ({ ...prevState, canNavigate: true }));
        } catch (err) {
            alert('An error occured: ' + err);
        }
    }

    render() {
        if (!this.state.canNavigate) {
            return <Spinner />;
        }

        return (
            <ApolloProvider client={apolloClient}>
                <Router />
            </ApolloProvider>
        );
    }
}

export default App;
