import _ from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Participant, Group, Event } from '../models';
// import socket from '../socket';

const checkAuth = (user) => {
	if (!user) {
		throw new Error('You must login');
	}
};

const checkAdmin = async (userId) => {
	const user = await User.findById(userId);
	if (!user || !user.isAdmin) {
		throw new Error('You are not authorized');
	}
};

export const Mutation = {
	createGroup: async (root, group, { user }) => {
		checkAuth(user);
		await checkAdmin(user.id);
		return Group.create(group);
	},

	createEvent: async (root, event, { user }) => {
		checkAuth(user);
		await checkAdmin(user.id);
		return Event.create(event);
	},

	register: async (root, { username, email, password }) => {
		const user = { username, email, password };
		user.password = await bcrypt.hash(user.password, 12);
		return User.create(user);
	},

	login: async (root, { email, password }, { secret }) => {
		const user = await User.findByEmail(email);
		if (!user) {
			throw new Error('No user with that email');
		}

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new Error('Incorrect password');
		}

		const token = jwt.sign(
			{ user: _.pick(user, ['id', 'username']) },
			secret,
			{ expiresIn: '1y' }
		);
		return token;
	},

	participate: async (root, { secretToken }, { user }) => {
		checkAuth(user);
		// socket.publish('EVENT_CREATED', { userAdded: user });
		return Participant.create(user.id, secretToken);
	},

	updatePosition: async (root, { latitude, longitude }, { user }) => {
		checkAuth(user);
		return Participant.updatePosition(user.id, latitude, longitude);
	}
};
