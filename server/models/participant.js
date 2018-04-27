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
        latitude: null,
        longitude: null,
        state: 'inactive',
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
    const threshold = 5;

    if (increment > 0) {
        const result = await r.table('groups').get(participant.group).update({
            distance: r.row('distance').default(0).add(increment),
            distanceIncrement: r.branch(
                r.row('distanceIncrement').default(0).add(increment).gt(threshold),
                0,
                r.row('distanceIncrement').default(0).add(increment)
            )
        }, {
            returnChanges: 'always'
        });

        const changes = result.changes[0];
        if (changes.new_val.distanceIncrement === 0) {
            console.log(`> Adding ${changes.old_val.distanceIncrement + increment} km to the event`);
            await r.table('events').get(participant.event).update({
                distance: r.row('distance').add(changes.old_val.distanceIncrement + increment)
            });
        }
    }

    const result = await r.table('participants').get(id).update({
        state: 'active',
        longitude,
        latitude,
        distance: r.row('distance').default(0).add(increment)
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
    move,
    onParticipantJoined
};
