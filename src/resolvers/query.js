import { User, Group, Event } from '../models';

export const Query = {
	getUser: (_, { id }) => {
		return User.findById(id);
	},
	getAllGroups: () => {
		return Group.findAll();
	},
	getAllEvents: () => {
		return Event.findAll();
	}
};
