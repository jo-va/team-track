import { Types } from 'mongoose';
import { Group as db } from '../connectors';
import { Event } from './event';

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

const create = async (group) => {
	// group.eventId must be valid
	const event = await Event.findById(group.eventId);
	if (event) {
		return db.create(group);
	}
	return null;
};

export const Group = {
	findAllByEventId,
	findById,
	findByName,
	findBySecretToken,
	create
};
