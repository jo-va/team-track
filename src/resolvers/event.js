import { Group } from '../models';

export const Event = {
	groups: ({ id }) => {
		return Group.findAllByEventId(id);
	}
};
