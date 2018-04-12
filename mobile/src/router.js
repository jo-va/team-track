import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import Enroll from './screens/Enroll';
import Home from './screens/Home';
import Profile from './screens/Profile';

const RouterComponent = () => {
	return (
		<Router>
			<Scene key='root' hideNavBar>
				<Scene key='auth' initial>
					<Scene key='signIn' component={SignIn} hideNavBar />
					<Scene key='signUp' component={SignUp} hideNavBar initial />
				</Scene>
				<Scene key='enroll' component={Enroll} title='Secret code' hideNavBar />
				<Scene key='main'>
					<Scene key='home' component={Home} title='Home' />
					<Scene key='profile' component={Profile} title='Profile' initial />
				</Scene>
			</Scene>
		</Router>
	);
};

export default RouterComponent;
