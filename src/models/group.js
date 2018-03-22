import { Types } from 'mongoose';
import { Group as db } from '../connectors';

const findAllByEventId = (eventId) => {
	if (eventId) {
		return Types.ObjectId.isValid(eventId) ? db.find({ eventId }) : [];
	}
	return db.find({});
};

const findById = (id) => {
	return db.findById(id);
};

const findByName = (name) => {
	return db.findOne({ name });
};

const findBySecretToken = (secretToken) => {
	return db.findOne({ secretToken });
};

const create = (group) => {
	// group.name must be unique
	// group.eventId must be valid
	return db.create(group);
};

export const Group = {
	findAllByEventId,
	findById,
	findByName,
	findBySecretToken,
	create
};
