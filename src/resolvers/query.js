import { Participant, Group, Event } from '../models';

export const Query = {
	participant: (_, { id }) => {
		return Participant.findById(id);
	},
	participants: (_, { groupId }) => {
		return Participant.findAllByGroupId(groupId);
	},
	group: (_, { id }) => {
		return Group.findById(id);
	},
	groups: (_, { eventId }) => {
		return Group.findAllByEventId(eventId);
	},
	event: (_, { id }) => {
		return Event.findById(id);
	},
	events: () => {
		return Event.findAll();
	}
};
