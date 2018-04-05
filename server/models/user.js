import { User as db } from '../connectors';

const findAll = () => {
    return db.find({});
};

const findById = (id) => {
    return db.findById(id);
};

const findByEmail = (email) => {
    return db.findOne({ email });
};

const findByEmailOrUsername = (value) => {
    return db.findOne({ $or: [{ email: value }, { username: value }] });
};

const create = async (user) => {
    // The username must be specified
    if (!user.username || !user.username.trim()) {
        throw new Error('Username cannot be blank');
    }

    // The email must be specified
    if (!user.email || !user.email.trim()) {
        throw new Error('Email cannot be blank');
    }

    // The email and username shall be unique
    const foundUser = await db.findOne({
        $or: [
            { username: user.username },
            { email: user.email }
        ]
    });

    if (foundUser && foundUser.email === user.email) {
        throw new Error('An account already exist for this email');
    } else if (foundUser && foundUser.username === user.username) {
        throw new Error('An account already exist for this username');
    }

    return db.create(user);
};

export const User = {
    findAll,
    findById,
    findByEmail,
    findByEmailOrUsername,
    create
};
