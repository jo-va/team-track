import React from 'react';
import PropTypes from 'prop-types';
import {
    NavigationActions,
    addNavigationHelpers,
    StackNavigator,
    TabNavigator
} from 'react-navigation';
import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { REHYDRATE } from 'redux-persist';

import Dashboard from './screens/dashboard.screen';
import Settings from './screens/settings.screen';
import Join from './screens/join.screen';

import { LOGOUT } from './constants/constants';
import CURRENT_PARTICIPANT_QUERY from './graphql/current-participant.query';
import ParticipantPropTypes from './graphql/participant.prop-types';

// tabs in main screen
const MainScreenNavigation = TabNavigator({
    Dashboard: { screen: Dashboard },
    Settings: { screen: Settings }
}, {
    initialRouteName: 'Dashboard'
});

const AppNavigator = StackNavigator({
    Main: {
        screen: MainScreenNavigation,
        navigationOptions: {
            header: null
        }
    },
    Join: { screen: Join }
}, {
    mode: 'modal'
});

// reducer initialization code
const initialState = AppNavigator.router.getStateForAction(
    NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({
                routeName: 'Main'
            })
        ]
    })
);

export const navigationReducer = (state = initialState, action) => {
    let nextState = AppNavigator.router.getStateForAction(action, state);
    switch (action.type) {
        case REHYDRATE:
            // convert persisted data to Immutable and confirm rehydration
            const { payload = { } } = action;
            if (!payload.auth || !payload.jwt) {
                const { routes, index } = state;
                if (routes[index].routeName !== 'Join') {
                    nextState = AppNavigator.router.getStateForAction(
                        NavigationActions.navigate({ routeName: 'Join' }),
                        state
                    );
                }
            }
            break;
        case LOGOUT:
            const { routes, index } = state;
            if (routes[index].routeName !== 'Join') {
                nextState = AppNavigator.router.getStateForAction(
                    NavigationActions.navigate({ routeName: 'Join' }),
                    state
                );
            }
            break;
        default:
            nextState = AppNavigator.router.getStateForAction(action, state);
            break;
    }

    // Simply return the original `state` if `nextState` is null or undefined
    return nextState || state;
};

// Note: createcreateReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
export const navigationMiddleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
);
const addListener = createReduxBoundAddListener('root');

class AppWithNavigationState extends React.Component {
    render() {
        return (
            <AppNavigator navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav,
                addListener
            })} />
        );
    }
}

AppWithNavigationState.propTypes = {
    auth: PropTypes.shape({
        id: PropTypes.string,
        jwt: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
    refetch: PropTypes.func,
    participant: ParticipantPropTypes
};

const mapStateToProps = ({ auth, nav }) => ({
    auth,
    nav
});

const currentParticipantQuery = graphql(CURRENT_PARTICIPANT_QUERY, {
    skip: ownProps => !ownProps.auth || !ownProps.auth.jwt,
    props: ({ data: { loading, refetch, currentParticipant } }) => ({
        loading,
        refetch,
        participant: currentParticipant
    })
});

export default compose(
    connect(mapStateToProps),
    currentParticipantQuery
)(AppWithNavigationState);
