import getRethink from '../connectors/rethink-driver';
import { Group } from './group';
import { Event } from './event';
import { calculateDistance } from './distance';

const findAll = async () => {
    const r = getRethink();
    return r.table('participants');
};

const findById = async (id) => {
    const r = getRethink();
    return r.table('participants').get(id).default(null);
};

const findByIdAndVersion = async (id, version) => {
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

const add = async (username, secret) => {
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
        latitude: null,
        longitude: null,
        state: 'inactive',
        version: 1
    };

    const r = getRethink();

    // The username shall be unique within the group
    const participantFound = await r.table('participants')
        .filter(doc => doc('username').downcase().eq(participant.username.toLowerCase()) && doc('group').eq(group.id))
        .nth(0)
        .default(null);
    
    if (participantFound) {
        throw new Error('User already exists');
    }

    const result = await r.table('participants').insert(
        r.expr(participant).merge({
            createdAt: r.now()
        }),
        { returnChanges: 'always' }
    );

    return result.changes[0].new_val;
};

// Updates the participant's position and distance
// If the position is valid, the group's distance will be updated as well,
// Returns the updated participant and group
const move = async (id, latitude, longitude) => {
    const r = getRethink();

    const participant = await r.table('participants').get(id).default(null);
    if (!participant) {
        throw new Error('You must join a group');
    }
    const event = await r.table('events').get(participant.event).default(null);
    if (!event) {
        throw new Error('No event found');
    }

    // make sure the participant is within the allowed event perimeter
    if (event.radius && event.radius > 0) {
        const dist2center = calculateDistance(event.latitude, event.longitude, latitude, longitude);
        if (dist2center > event.radius) {
            const result = await r.table('participants').get(id).update({
                state: 'inactive'
            }, { returnChanges: 'always' });
            return result.changes[0].new_val;
        }
    }

    // If we just entered the perimeter, don't update the distance since the last point was outside,
    // update the state only
    if (participant.state === 'inactive') {
        const result = await r.table('participants').get(id).update({
            state: 'active'
        }, { returnChanges: 'always' });
        return result.changes[0].new_val;
    }

    // Calculate displacement
    const increment = calculateDistance(participant.latitude, participant.longitude, latitude, longitude);

    if (increment > 0) {
        const result = await r.table('groups').get(participant.group).update(group => {
            return r.branch(
                // check if the threshold is reached and if we are the first to reach it
                group('eventDistanceIncrement').gt(process.env.EVENT_DISTANCE_UPDATE_THRESHOLD) &&
                group('eventLocked').default(false).eq(false),
                {
                    distance: group('distance').add(increment).default(0),
                    eventDistanceIncrement: increment,
                    eventLocked: true
                },
                {
                    distance: group('distance').add(increment).default(0),
                    eventDistanceIncrement: group('eventDistanceIncrement').add(increment).default(0),
                    eventLocked: false
                }
            );
        }, {
            returnChanges: 'always'
        });

        const changes = result.changes[0];
        if (changes.new_val.eventLocked === true) {
            await r.table('events').get(participant.event).update({
                distance: r.row('distance').add(changes.old_val.eventDistanceIncrement)
            });
        }
    }

    const result = await r.table('participants').get(id).update({
        state: 'active',
        longitude,
        latitude,
        distance: r.row('distance').add(increment).default(0)
    }, { returnChanges: 'always' });

    return result.changes[0].new_val;
};

export const Participant = {
    findAll,
    findById,
    findByIdAndVersion,
    findAllByGroupId,
    add,
    move
};
