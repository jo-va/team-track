import { User, Event } from '../models';

export const Group = {
	event: ({ eventId }) => {
		return Event.findById(eventId);
	},
	users: ({ id }) => {
		return User.findAllByGroupId(id);
	}
};
