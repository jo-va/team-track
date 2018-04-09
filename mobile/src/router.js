import React from 'react';
import { StackNavigator, TabNavigator, SwitchNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import Home from './screens/Home';
import Profile from './screens/Profile';

/*const mapNavigationStateParamsToProps = (SomeComponent) => {
    return class extends React.Component {
        static navigationOptions = SomeComponent.navigationOptions;
        render() {
            const { navigation, ...otherProps } = this.props;
            const { state: { params } } = navigation;
            return <SomeComponent {...this.props} {...params} />;
        }
    }
}*/

export const SignedOut = StackNavigator({
    SignUp: { screen: SignUp },
    SignIn: { screen: SignIn }
});

export const SignedIn = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor }) => (
                <Icon name='home' color={tintColor} size={30} />
            )
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarLabel: 'Profile',
            tabBarIcon: ({ tintColor }) => (
                <Icon name='user' color={tintColor} size={30} />
            )
        }
    }
});

export const createRootNavigator = (signedIn = false) => {
    return SwitchNavigator(
        {
            SignedIn: {
                screen: SignedIn
            },
            SignedOut: {
                screen: SignedOut
            }
        },
        {
            initialRouteName: signedIn ? 'SignedIn' : 'SignedOut'
        }
    );
};
