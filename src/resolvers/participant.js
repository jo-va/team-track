import { User, Group } from '../models';

export const Participant = {
	name: async ({ userId }) => {
		const user = await User.findById(userId);
		return user.name;
	},
	user: ({ userId }) => {
		return User.findById(userId);
	},
	group: ({ groupId }) => {
		return Group.findById(groupId);
	}
};
