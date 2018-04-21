import { Event as db } from '../connectors';

const findAll = () => {
    return db.find({}).exec();
};

const findById = (id) => {
    return db.findById(id).exec();
};

const findAllById = (ids) => {
    return db.find({ _id: { $in: ids } });
}

const add = (event) => {
    if (!event.name || !event.name.trim()) {
        throw new Error('Event name cannot be blank');
    }
    return db.create(event);
};

export const Event = {
    findAll,
    findById,
    findAllById,
    add
};
