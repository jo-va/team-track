import { User as db } from '../connectors';

const findAll = () => {
	return db.find({});
};

const findById = (id) => {
	return db.findById(id);
};

export const User = {
	findAll,
	findById
};
