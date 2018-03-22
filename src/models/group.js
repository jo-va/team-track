import { Group as db } from '../connectors';

const findAll = () => {
	return db.find({});
};

const findById = (id) => {
	return db.findById(id);
};

const findByName = (name) => {
	return db.findOne({ name });
};

const create = (group) => {
	return db.create(group);
};

export const Group = {
	findAll,
	findById,
	findByName,
	create
};
