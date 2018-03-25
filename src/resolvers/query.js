import { User, Participant, Group, Event } from '../models';

export const Query = {
	participant: (root, { id }) => {
		return Participant.findById(id);
	},
	participants: (root, { group }) => {
		return Participant.findAllByGroupId(group);
	},
	group: (root, { id }) => {
		return Group.findById(id);
	},
	groups: (root, { event }) => {
		return Group.findAllByEventId(event);
	},
	event: (root, { id }) => {
		return Event.findById(id);
	},
	events: () => {
		return Event.findAll();
	},
	currentUser: (root, args, { user }) => {
		if (user) {
			return User.findById(user.id);
		}
		return null;
	},
	currentParticipant: (root, args, { user }) => {
		if (user) {
			return Participant.findByUserId(user.id);
		}
		return null;
	}
};
