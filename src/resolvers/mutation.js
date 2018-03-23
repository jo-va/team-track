import { Participant, Group, Event } from '../models';
// import socket from '../socket';

export const Mutation = {
	createParticipant: (_, { userId, secretToken }) => {
		// socket.publish('EVENT_CREATED', { userAdded: user });
		return Participant.create(userId, secretToken);
	},
	createGroup: (_, group) => {
		return Group.create(group);
	},
	createEvent: (_, event) => {
		return Event.create(event);
	}
};
