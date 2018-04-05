import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import Dashboard from './screens/dashboard.screen';
import Login from './screens/login.screen';
import Participate from './screens/participate.screen';
import Profile from './screens/profile.screen';
import Register from './screens/register.screen';

const RouterComponent = () => {
    return (
        <Router>
            <Scene key='root' hideNavBar>
                <Scene key='auth' initial>
                    <Scene key='login' component={Login} title='Please Login' hideNavBar initial />
                    <Scene key='register' component={Register} title='Please Register' hideNavBar />
                </Scene>
                <Scene key='participate' component={Participate} title='Secret code' hideNavBar />
                <Scene key='main'>
                    <Scene key='dashboard' component={Dashboard} title='Dashboard' initial />
                    <Scene key='profile' component={Profile} title='Profile' />
                </Scene>
            </Scene>
        </Router>
    );
};

export default RouterComponent;