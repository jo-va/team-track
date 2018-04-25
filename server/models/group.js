import crypto from 'crypto';
import getRethink from '../connectors/rethink-driver';

const findAll = async () => {
    const r = getRethink();
    return r.table('groups');
};

const findAllByEventId = async (eventId) => {
    const r = getRethink();
    if (eventId) {
        return r.table('groups').filter({ event: eventId });
    } else {
        return r.table('groups');
    }
};

const findById = async (id) => {
    const r = getRethink();
    return r.table('groups').get(id).default(null);
};

const findByName = async (name) => {
    const r = getRethink();
    return r.table('groups')
        .filter(doc => doc('name').downcase().eq(name.toLowerCase()))
        .nth(0)
        .default(null);
};

const findBySecret = async (secret) => {
    const r = getRethink();
    return r.table('groups')
        .filter({ secret })
        .nth(0)
        .default(null);
};

const add = async ({ name, secret, event }) => {
    const group = {
        name: name.trim(),
        secret: secret ? secret.trim() : crypto.randomBytes(3).toString('hex'),
        event,
        distance: 0,
        eventDistanceIncrement: 0
    };

    // name must be specified
    if (!group.name) {
        throw new Error('Group name cannot be blank');
    }

    // The name must be unique
    let duplicate = await findByName(group.name);
    console.log(duplicate);
    console.log(group);
    if (duplicate) {
        throw new Error('A group already exists with this name');
    }

    // The secret must be unique
    if (group.secret) {
        duplicate = await findBySecret(group.secret);
        if (duplicate) {
            throw new Error('This secret is already used');
        }
    }

    // An event must exist for this group
    const r = getRethink();
    const eventFound = await r.table('events').get(event).default(null);
    if (!eventFound) {
        throw new Error(`Found no event with id ${event}`);
    }    

    const result = await r.table('groups').insert(
        r.expr(group).merge({
            createdAt: r.now()
        }),
        { returnChanges: 'always' }
    );

    return result.changes[0].new_val;
};

const onDistanceUpdate = handler => {
    const r = getRethink();

    r.table('groups')
        .changes({ includeInitial: false })
        .filter(r.row('new_val')('distance').ne(r.row('old_val')('distance')))
        .run()
        .then(cursor => {
            cursor.each(async (err, record) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('group handler called');
                    handler(record.new_val);
                }
            })
        });
};

export const Group = {
    findAllByEventId,
    findById,
    findAll,
    findBySecret,
    add,
    onDistanceUpdate,
};
