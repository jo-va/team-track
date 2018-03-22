import { Group } from '../models';

export const Event = {
	groups: ({ eventId }) => {
		return Group.findAllByEventId(eventId);
	}
};
