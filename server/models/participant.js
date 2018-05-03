import getRethink from '../connectors/rethink-driver';
import { Group } from './group';
import { Event } from './event';
import { calculateDistance } from './distance';

const findAll = async () => {
    const r = getRethink();
    return r.table('participants');
};

const findById = async (id) => {
    if (!id) {
        return null;
    }
    const r = getRethink();
    return r.table('participants').get(id).default(null);
};

const findByIdAndVersion = async (id, version) => {
    if (!id) {
        return null;
    }
    const r = getRethink();
    return r.table('participants')
        .filter({ id, version })
        .nth(0)
        .default(null);
};

const findAllByGroupId = async (groupId) => {
    const r = getRethink();
    if (groupId) {
        return r.table('participants').filter({ group: groupId });
    } else {
        return r.table('participants');
    }
};

const create = async (username, secret) => {
    // The secret token for the group must be valid
    const group = await Group.findBySecret(secret);
    if (!group) {
        throw new Error('No group found');
    }

    const participant = {
        username: username.trim(),
        group: group.id,
        event: group.event,
        distance: 0,
        location: null,
        isActive: false,
        isOutOfRange: false,
        version: 1
    };

    const r = getRethink();

    // The username shall be unique within the group
    const participantFound = await r.table('participants')
        .filter(r.row('username').downcase().eq(participant.username.toLowerCase()).and(r.row('group').eq(group.id)))
        .nth(0)
        .default(null);
    
    if (participantFound) {
        throw new Error(`User ${participant.username} already exists`);
    }

    const result = await r.table('participants').insert(
        r.expr(participant).merge({
            createdAt: r.now()
        }),
        { returnChanges: 'always' }
    );

    return result.changes[0].new_val;
};

// See this for a kalman filter:
// https://medium.com/@mizutori/make-it-even-better-than-nike-how-to-filter-locations-tracking-highly-accurate-location-in-1c9d53d31d93
const MAX_AGE = 2000;
const MIN_DISTANCE = 0.01;
const MAX_GROUP_DISTANCE_ACCUM = 1;

function filterLocation(location) {
    if (!location ||
        location.latitude === null ||
        location.longitude === null ||
        location.accuracy === null) {
        return null;
    }

    if (location.accuracy < 0) {
        return null;
    }

    if (location.accuracy > 100) {
        return null;
    }

    const interval = Math.abs(Date.now() - location.timestamp);
    if (interval > MAX_AGE) {
        return null;
    }

    return location;
}

// Updates the participant's position and distance
// If the position is valid, the group's distance will be updated as well,
// Returns the updated participant and group
const addLocation = async (id, { latitude, longitude, speed = null, heading = null, accuracy, timestamp }) => {
    const r = getRethink();

    //console.log({ latitude, longitude, speed, heading, accuracy, timestamp })

    const participant = await r.table('participants').get(id).default(null);
    if (!participant) {
        throw new Error('You must join a group');
    }

    // Ignore if inactive
    if (!participant.isActive) {
        return participant;
    }

    const event = await r.table('events').get(participant.event).default(null);
    if (!event) {
        throw new Error('No event found');
    }

    // Filter the location before we use it
    const location = filterLocation({ latitude, longitude, speed, accuracy, timestamp });
    if (!location) {
        return participant;
    }

    // make sure the participant is within the allowed event perimeter
    if (event.radius && event.radius > 0) {
        const eventLocation = {
            longitude: event.location.coordinates[0],
            latitude: event.location.coordinates[1]
        };
        const dist2center = calculateDistance(eventLocation, location);
        if (dist2center > event.radius) {
            if (!participant.isOutOfRange) {
                const result = await r.table('participants').get(id).update({
                    isOutOfRange: true
                }, { returnChanges: 'always' });
                return result.changes[0].new_val;
            } else {
                return participant;
            }
        }
    }

    // If we just entered the perimeter, don't update the distance since the last point was outside,
    // update the state and location only
    if (participant.isOutOfRange) {
        const result = await r.table('participants').get(id).update({
            isOutOfRange: false,
            location: r.point(location.longitude, location.latitude)
        }, { returnChanges: 'always' });
        return result.changes[0].new_val;
    }

    if (!participant.location) {
        const result = await r.table('participants').get(id).update({
            location: r.point(location.longitude, location.latitude)
        }, { returnChanges: 'always' });

        return result.changes[0].new_val;
    }

    // Calculate displacement
    const participantLocation = {
        longitude: participant.location.coordinates[0],
        latitude: participant.location.coordinates[1]
    };
    const increment = calculateDistance(participantLocation, location);
    console.log('> Increment = ' + increment);
    if (increment > MIN_DISTANCE) {
        let result = await r.table('groups').get(participant.group).update({
            distance: r.row('distance').default(0).add(increment),
            distanceAccum: r.branch(
                r.row('distanceAccum').default(0).add(increment).gt(MAX_GROUP_DISTANCE_ACCUM),
                0,
                r.row('distanceAccum').default(0).add(increment)
            )
        }, {
            returnChanges: 'always'
        });

        const changes = result.changes[0];
        if (changes.new_val.distanceAccum === 0) {
            console.log(`> Adding ${changes.old_val.distanceAccum + increment} km to the event`);
            await r.table('events').get(participant.event).update({
                distance: r.row('distance').default(0).add(changes.old_val.distanceAccum + increment)
            });
        }

        result = await r.table('participants').get(id).update({
            location: r.point(location.longitude, location.latitude),
            distance: r.row('distance').default(0).add(increment)
        }, { returnChanges: 'always' });

        return result.changes[0].new_val;
    }
    return participant;
};

const startTracking = async (id) => {
    const r = getRethink();
    const result = await r.table('participants').get(id).update({
        isActive: true
    }, { returnChanges: 'always' });

    return result.changes[0].new_val;
};

const stopTracking = async (id) => {
    const r = getRethink();
    const result = await r.table('participants').get(id).update({
        isActive: false
    }, { returnChanges: 'always' });

    return result.changes[0].new_val;
};

const onParticipantJoined = handler => {
    const r = getRethink();

    r.table('participants')
        .changes({ includeInitial: false })
        .filter(r.row('old_val').eq(null))
        .run()
        .then(cursor => {
            cursor.each(async (err, record) => {
                if (err) {
                    console.error('onParticipantJoined Error: ', err);
                } else {
                    handler(record.new_val);
                }
            })
        });
};

export const Participant = {
    findAll,
    findById,
    findByIdAndVersion,
    findAllByGroupId,
    create,
    addLocation,
    startTracking,
    stopTracking,
    onParticipantJoined
};
