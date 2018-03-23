import { Participant, Event } from '../models';

export const Group = {
	event: ({ eventId }) => {
		return Event.findById(eventId);
	},
	participants: ({ id }) => {
		return Participant.findAllByGroupId(id);
	}
};
