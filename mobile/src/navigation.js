import React from 'react';
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
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { REHYDRATE } from 'redux-persist';
import Signin from './screens/signin.screen';
import Join from './screens/join.screen';
import { LOGOUT } from './constants/constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    tabText: {
        color: '#777',
        fontSize: 10,
        justifyContent: 'center'
    },
    selected: {
        color: 'blue'
    }
});

const TestScreen = title => () => (
    <View style={styles.container}>
        <Text>{title}</Text>
    </View>
);

// tabs in main screen
const MainScreenNavigation = TabNavigator({
    Dashboard: { screen: TestScreen('Dashboard') },
    Profile: { screen: TestScreen('Profile') },
    Settings: { screen: TestScreen('Settings') }
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
    Signin: { screen: Signin },
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
                if (routes[index].routeName !== 'Signin') {
                    nextState = AppNavigator.router.getStateForAction(
                        NavigationActions.navigate({ routeName: 'Signin' }),
                        state
                    );
                }
            }
            break;
        case LOGOUT:
            const { routes, index } = state;
            if (routes[index].routeName !== 'Signin') {
                nextState = AppNavigator.router.getStateForAction(
                    NavigationActions.navigate({ routeName: 'Signin' }),
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

const mapStateToProps = state => ({
    nav: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
