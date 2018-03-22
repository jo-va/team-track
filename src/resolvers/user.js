import { Group } from '../models';

export const User = {
	group: ({ groupId }) => {
		return Group.findById(groupId);
	}
};
