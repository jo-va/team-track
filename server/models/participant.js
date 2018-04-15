import { Types } from 'mongoose';
import * as db from '../connectors';
import { Group } from './group';
import { calculateDistance } from './distance';

const findAll = () => {
    return db.Participant.find({}).exec();
};

const findById = (id) => {
    return db.Participant.findById(id).exec();
};

const findByIdAndVersion = (id, version) => {
    return db.Participant.findOne({ _id: id, version }).exec();
};

const findAllByGroupId = (id) => {
    if (id) {
        return Types.ObjectId.isValid(id) ?
            db.Participant.find({ group: id }).exec() : [];
    }
    return db.Participant.find({}).exec();
};

// Add a new participant to a group
const add = async (username, secret) => {
    // The secret token for the group must be valid
    const group = await Group.findBySecret(secret);
    if (!group) {
        throw new Error('No group found');
    }

    const participant = { username: username.trim(), group: group._id };

    // The username shall be unique within the group
    const foundParticipant = await db.Participant.findOne(participant).exec();
    if (foundParticipant) {
        throw new Error('User already exists');
    }
    return db.Participant.create(participant);
};

const move = async (id, latitude, longitude) => {
    const participant = await db.Participant.findById(id).populate('group', 'event').exec();
    if (!participant) {
        throw new Error('You must join a group');
    }
    const event = await db.Event.findById(participant.group.event).exec();
    if (!event) {
        throw new Error('No event found');
    }

    // make sure the participant is within the allowed event perimeter
    const dist2center = calculateDistance(event.latitude, event.longitude, latitude, longitude);
    if (dist2center > event.radius) {
        return db.Participant.findByIdAndUpdate(participant._id, { $set: { state: 'inactive' } }).exec();
    }

    // If we just entered the perimeter, don't update the distance since the last point was outside,
    // update the state only
    if (participant.state === 'inactive') {
        return db.Participant.findByIdAndUpdate(participant._id, { $set: { state: 'active' } }).exec();
    }

    // Calculate new distance
    const dt = calculateDistance(participant.latitude, participant.longitude, latitude, longitude);
    const distance = participant.distance + dt;

    // Increment group and event distance
    await db.Group.findByIdAndUpdate(participant.group._id, { $inc: { distance: dt } }).exec();
    await db.Event.findByIdAndUpdate(event._id, { $inc: { distance: dt } }).exec();

    return db.Participant.findByIdAndUpdate(participant._id, {
        $set: {
            state: 'active',
            longitude,
            latitude,
            distance
        }
    }).exec();
};

export const Participant = {
    findAll,
    findById,
    findByIdAndVersion,
    findAllByGroupId,
    add,
    move
};
