import { User, Group, Event } from '../models';
import socket from '../socket';

export const Mutation = {
	createUser: (_, { user }) => {
		socket.publish('EVENT_CREATED', { userAdded: user });
		return User.create(user);
	},
	createGroup: (_, { group }) => {
		console.log(group);
		return Group.create(group);
	},
	createEvent: (_, { event }) => {
		return Event.create(event);
	}
};
