import { Types } from 'mongoose';
import * as db from '../connectors';
import { Group } from './group';
import { Event } from './event';
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

    const participant = { username: username.trim(), group: group._id, event: group.event };

    // The username shall be unique within the group
    const foundParticipant = await db.Participant.findOne(participant).exec();
    if (foundParticipant) {
        throw new Error('User already exists');
    }
    return db.Participant.create(participant);
};

// Updates the participant's position and distance
// If the position is valid, the group's distance will be updated as well,
// Returns the updated participant and group
const move = async (id, latitude, longitude) => {
    const participant = await db.Participant.findById(id).populate('event').exec();
    if (!participant) {
        throw new Error('You must join a group');
    }
    const event = participant.event;
    if (!event) {
        throw new Error('No event found');
    }

    // make sure the participant is within the allowed event perimeter
    const dist2center = calculateDistance(event.latitude, event.longitude, latitude, longitude);
    if (dist2center > event.radius) {
        return db.Participant.findByIdAndUpdate(id, { $set: { state: 'inactive' } }, { new: true }).exec();
    }

    // If we just entered the perimeter, don't update the distance since the last point was outside,
    // update the state only
    if (participant.state === 'inactive') {
        return db.Participant.findByIdAndUpdate(id, { $set: { state: 'active' } }, { new: true }).exec();
    }

    // Calculate new distance
    const increment = calculateDistance(participant.latitude, participant.longitude, latitude, longitude);
    const distance = participant.distance + increment;

    if (increment > 0) {
        const updatedGroup = db.Group.findByIdAndUpdate(participant.group, {
            $inc: {
                eventDistanceIncrement: increment,
                distance: increment
            }
        }, { new: true }).exec();

        Group.onDistanceUpdated(await updatedGroup);
    }

    return db.Participant.findByIdAndUpdate(id, {
        $set: {
            state: 'active',
            longitude,
            latitude,
            distance
        }
    }, { new: true }).exec();
};

export const Participant = {
    findAll,
    findById,
    findByIdAndVersion,
    findAllByGroupId,
    add,
    move
};

// Change stream event handler listening to group distance changes triggered by Participant.move()
db.MongoDBConnection.then(mongodb => {
    const distance_increment_threshold = 5;

    const pipeline = [{
        $match: { 'fullDocument.eventDistanceIncrement': { $gte: distance_increment_threshold } }
    }];

    mongodb.collection('groups').watch(pipeline, {
        fullDocument: 'updateLookup'
    }).on('change', async (data) => {
        const increment = data.fullDocument.eventDistanceIncrement;
        console.log(`event distance +${increment}`);

        db.Group.findByIdAndUpdate(data.fullDocument._id, { $set: { eventDistanceIncrement: 0 } }).exec();
        const event = db.Event.findByIdAndUpdate(data.fullDocument.event, { $inc: { distance: increment } }, { new: true }).exec();

        Event.onDistanceUpdated(await event);
    });
});
