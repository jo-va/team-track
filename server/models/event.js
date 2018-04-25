import getRethink from '../connectors/rethink-driver';

const findAll = async () => {
    const r = getRethink();
    return r.table('events');
};

const findById = async (id) => {
    const r = getRethink();
    return r.table('events').get(id).default(null);
};

const findAllById = async (ids) => {
    const r = getRethink();
    return r.table('events').getAll(r.args(ids));
}

const add = async ({ name, latitude, longitude, radius}) => {
    const event = {
        name: name.trim(),
        latitude: latitude || null,
        longitude: longitude || null,
        radius: radius || 0,
        distance: 0,
        state: 'inactive'
    };

    if (!event.name) {
        throw new Error('Event name cannot be blank');
    }

    const r = getRethink();

    const eventFound = await r.table('events')
        .filter(doc => doc('name').downcase().eq(name.toLowerCase()))
        .nth(0)
        .default(null);

    if (eventFound) {
        throw new Error('Event name already used');
    }

    const result = await r.table('events').insert(
        r.expr(event).merge({
            createdAt: r.now()
        }),
        { returnChanges: true }
    );

    return result.changes[0].new_val;
};

let distanceHandler = null;

const registerDistanceUpdatedHandler = handler => {
    distanceHandler = handler;
};

const onDistanceUpdated = event => {
    if (distanceHandler) {
        distanceHandler(event);
    }
};

export const Event = {
    findAll,
    findById,
    findAllById,
    add,
    onDistanceUpdated,
    registerDistanceUpdatedHandler
};
