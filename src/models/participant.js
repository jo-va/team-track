import { Types } from 'mongoose';
import { Participant as db } from '../connectors';
import { User, Group } from './group';

const findAllByGroupId = (groupId) => {
	if (groupId) {
		return Types.ObjectId.isValid(groupId) ? db.find({ groupId }) : [];
	}
	return db.find({});
};

const findById = (id) => {
	return db.findById(id);
};

const create = async (userId, secretToken) => {
	const user = await User.findById(userId);
	if (user) {
		const group = await Group.findBySecretToken(secretToken);
		if (group) {
			return db.create({ userId: user._id, groupId: group._id });
		}
	}
	return null;
};

export const Participant = {
	findAllByGroupId,
	findById,
	create
};
