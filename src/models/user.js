import { Types } from 'mongoose';
import { User as db } from '../connectors';
import { Group } from './group';

const findAllByGroupId = (groupId) => {
	if (groupId) {
		return Types.ObjectId.isValid(groupId) ? db.find({ groupId }) : [];
	}
	return db.find({});
};

const findById = (id) => {
	return db.findById(id);
};

const create = async ({ name, secretToken }) => {
	// name must be unique
	// secretToken must exist
	const group = await Group.findBySecretToken(secretToken);
	if (group) {
		return db.create({ name, groupId: group._id });
	}
	return null;
};

export const User = {
	findAllByGroupId,
	findById,
	create
};
