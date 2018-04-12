import { Types } from 'mongoose';
import * as db from '../connectors';
import { Group } from './group';
import { calculateDistance } from './distance';

const findAll = () => {
    return db.User.find({});
};

const findById = (id) => {
    return db.User.findById(id);
};

const findByEmailOrUsername = (value) => {
    return db.User.findOne({ $or: [{ email: value }, { username: value }] });
};

const findAllByGroupId = (groupId) => {
    if (groupId) {
        return Types.ObjectId.isValid(groupId) ?
            db.User.find({ group: groupId }) : [];
    }
    return db.User.find({});
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
    const foundUser = await db.User.findOne({
        $or: [
            { username: user.username },
            { email: user.email }
        ]
    });

    if (foundUser && foundUser.email === user.email) {
        throw new Error('Email already exists');
    } else if (foundUser && foundUser.username === user.username) {
        throw new Error('Username already exists');
    }

    return db.User.create(user);
};

const joinGroup = async (userId, secretToken) => {
    // The secret token for the group must be valid
    const group = await Group.findBySecretToken(secretToken);
    if (!group) {
        throw new Error('No group found');
    }

    const user = await db.User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user.set({ group: group._id }).save();
};

const updatePosition = async (userId, latitude, longitude) => {
    const user = await db.User.findById(userId).populate('group', 'event');
    if (!user) {
        throw new Error('You must join a group');
    }
    const event = await db.Event.findById(user.group.event);
    if (!event) {
        throw new Error('No event found');
    }

    // make sure the participant is within the allowed event perimeter
    const dist2center = calculateDistance(event.latitude, event.longitude, latitude, longitude);
    if (dist2center > event.radius) {
        return user.set({ state: 'inactive' }).save();
    }

    // If we just entered the perimeter, don't update the distance since the last point was outside,
    // update the state only
    if (user.state === 'inactive') {
        return user.set({ state: 'active' }).save();
    }

    // Calculate new distance
    const dt = calculateDistance(user.latitude, user.longitude, latitude, longitude);
    const distance = user.distance + dt;

    // Increment group and event distance
    await db.Group.findByIdAndUpdate(user.group._id, { $inc: { distance: dt } });
    await db.Event.findByIdAndUpdate(event._id, { $inc: { distance: dt } });

    return user.set({
        longitude,
        latitude,
        distance,
        state: 'active'
    }).save();
};

export const User = {
    findAll,
    findById,
    findByEmailOrUsername,
    findAllByGroupId,
    create,
    joinGroup,
    updatePosition
};
