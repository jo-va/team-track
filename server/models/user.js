import { Types } from 'mongoose';
import * as db from '../connectors';

const findAll = () => {
    return db.User.find({}).exec();
};

const findById = (id) => {
    return db.User.findById(id).exec();
};

const findByIdAndVersion = (id, version) => {
    return db.User.findOne({ _id: id, version }).exec();
};

const findByUsername = (username) => {
    return db.User.findOne({ username }).exec();
};

const add = async (user) => {
    // The username must be specified
    if (!user.username || !user.username.trim()) {
        throw new Error('Username cannot be blank');
    }    

    // The username shall be unique
    const foundUser = await db.User.findOne({ username: user.username }).exec();

    if (foundUser && foundUser.username === user.username) {
        throw new Error('User already exists');
    }

    return db.User.create(user);
};

export const User = {
    findAll,
    findById,
    findByIdAndVersion,
    findByUsername,
    add
};
