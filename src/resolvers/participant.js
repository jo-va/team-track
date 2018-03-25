import { User, Group } from '../models';

export const Participant = {
	username: async (participant) => {
		const user = await User.findById(participant.user);
		return user.username;
	},
	user: (participant) => {
		return User.findById(participant.user);
	},
	group: (participant) => {
		return Group.findById(participant.group);
	}
};
