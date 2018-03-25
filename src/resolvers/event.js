import { Group } from '../models';

export const Event = {
	groups: (event) => {
		return Group.findAllByEventId(event.id);
	}
};
