import { Types } from 'mongoose';
import * as db from '../connectors';
import { Group } from './group';
import { calculateDistance } from './distance';

const findAllByGroupId = (groupId) => {
    if (groupId) {
        return Types.ObjectId.isValid(groupId) ?
            db.Participant.find({ group: groupId }) : [];
    }
    return db.Participant.find({});
};

const findById = (id) => {
    return db.Participant.findById(id);
};

const findByUserId = (userId) => {
    return db.Participant.findOne({ user: userId });
};

const create = async (userId, secretToken) => {
    // A user must exist for this new participant
    const user = await db.User.findById(userId);
    if (!user) {
        throw new Error(`No user found with id ${userId}`);
    }

    // The secret token must be valid
    const group = await Group.findBySecretToken(secretToken);
    if (!group) {
        throw new Error('No group found for this secret');
    }

    // The user can't be in multiple groups
    // If a participant already exists, update its group.
    const other = await findByUserId(userId);
    if (other) {
        return other.set({ group: group._id }).save();
    }

    return db.Participant.create({
        user: user._id,
        group: group._id,
    });
};

const updatePosition = async (userId, latitude, longitude) => {
    const participant = await db.Participant.findOne({ user: userId }).populate('group', 'event');
    if (!participant) {
        throw new Error('You must participate to the event');
    }
    const event = await db.Event.findById(participant.group.event);
    if (!event) {
        throw new Error('No event found');
    }

    // make sure the participant is within the allowed event perimeter
    const dist2center = calculateDistance(event.latitude, event.longitude, latitude, longitude);
    if (dist2center > event.radius) {
        return participant.set({ state: 'inactive' }).save();
    }

    // If we just entered the perimeter, don't update the distance since the last point was outside,
    // update the state only
    if (participant.state === 'inactive') {
        return participant.set({ state: 'active' }).save();
    }

    // Calculate new distance
    const dt = calculateDistance(participant.latitude, participant.longitude, latitude, longitude);
    const distance = participant.distance + dt;

    // Increment group and event distance
    await db.Group.findByIdAndUpdate(participant.group._id, { $inc: { distance: dt } });
    await db.Event.findByIdAndUpdate(event._id, { $inc: { distance: dt } });

    return participant.set({
        longitude,
        latitude,
        distance,
        state: 'active'
    }).save();
};

export const Participant = {
    findAllByGroupId,
    findByUserId,
    findById,
    create,
    updatePosition
};
