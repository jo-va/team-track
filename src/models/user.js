import { User as db } from '../connectors';

const findAll = () => {
	return db.find({});
};

const findById = (id) => {
	return db.findById(id);
};

const create = (user) => {
	return db.create(user);
};

export const User = {
	findAll,
	findById,
	create
};
