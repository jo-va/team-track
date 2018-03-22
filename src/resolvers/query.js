import { User, Group, Event } from '../models';

export const Query = {
	getUser: (_, { id }) => {
		return User.findById(id);
	},
	getAllUsers: (_, { groupId }) => {
		return User.findAllByGroupId(groupId);
	},
	getGroup: (_, { id }) => {
		return Group.findById(id);
	},
	getAllGroups: (_, { eventId }) => {
		return Group.findAllByEventId(eventId);
	},
	getEvent: (_, { id }) => {
		return Event.findById(id);
	},
	getAllEvents: () => {
		return Event.findAll();
	}
};
