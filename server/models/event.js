import { Event as db } from '../connectors';

const findAll = () => {
    return db.find({});
};

const findById = (id) => {
    return db.findById(id);
};

const create = (event) => {
    if (!event.name || !event.name.trim()) {
        throw new Error('Event name cannot be blank');
    }
    return db.create(event);
};

export const Event = {
    findAll,
    findById,
    create
};
