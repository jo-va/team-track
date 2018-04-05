import { Types } from 'mongoose';
import * as db from '../connectors';

const findAllByEventId = (event) => {
	if (event) {
		return Types.ObjectId.isValid(event) ? db.Group.find({ event }) : [];
	}
	return db.Group.find({});
};

const findById = (id) => {
	return db.Group.findById(id);
};

const findByName = (name) => {
	return db.Group.findOne({ name });
};

const findBySecretToken = (secretToken) => {
	return db.Group.findOne({ secretToken });
};

const create = async (group) => {
	// name must be specified
	if (!group.name || !group.name.trim()) {
		throw new Error('Group name cannot be blank');
	}

	// An event must exist for this group
	if (!Types.ObjectId.isValid(group.event)) {
		throw new Error('Invalid Event ID');
	}
	const event = await db.Event.findById(group.event);
	if (!event) {
		throw new Error(`Found no event with id ${group.event}`);
	}

	// The name must be unique
	let duplicate = await findByName(group.name);
	if (duplicate) {
		throw new Error('A group already exists with this name');
	}

	// The secret must be unique
	if (group.secretToken && group.secretToken.trim()) {
		duplicate = await findBySecretToken(group.secretToken);
		if (duplicate) {
			throw new Error('This secret is already used');
		}
	}

	return db.Group.create(group);
};

export const Group = {
	findAllByEventId,
	findById,
	findByName,
	findBySecretToken,
	create
};
