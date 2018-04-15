import { Types } from 'mongoose';
import * as db from '../connectors';

const findAll = () => {
    return db.Group.find({}).exec();
};

const findAllByEventId = (event) => {
    if (event) {
        return Types.ObjectId.isValid(event) ? db.Group.find({ event }).exec() : [];
    }
    return db.Group.find({}).exec();
};

const findById = (id) => {
    return db.Group.findById(id).exec();
};

const findByName = (name) => {
    return db.Group.findOne({ name }).exec();
};

const findBySecret = (secret) => {
    return db.Group.findOne({ secret }).exec();
};

const add = async (group) => {
    // name must be specified
    if (!group.name || !group.name.trim()) {
        throw new Error('Group name cannot be blank');
    }

    // An event must exist for this group
    if (!Types.ObjectId.isValid(group.event)) {
        throw new Error('Invalid Event ID');
    }
    const event = await db.Event.findById(group.event).exec();
    if (!event) {
        throw new Error(`Found no event with id ${group.event}`);
    }

    // The name must be unique
    let duplicate = await findByName(group.name);
    if (duplicate) {
        throw new Error('A group already exists with this name');
    }

    // The secret must be unique
    if (group.secret && group.secret.trim()) {
        duplicate = await findBySecret(group.secret);
        if (duplicate) {
            throw new Error('This secret is already used');
        }
    }

    return db.Group.create(group);
};

export const Group = {
    findAllByEventId,
    findById,
    findAll,
    findBySecret,
    add
};
