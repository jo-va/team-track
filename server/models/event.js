import getRethink from '../connectors/rethink-driver';

const findAll = async () => {
    const r = getRethink();
    return r.table('events');
};

const findById = async (id) => {
    if (!id) {
        return null;
    }
    const r = getRethink();
    return r.table('events').get(id).default(null);
};

const findAllById = async (ids) => {
    const r = getRethink();
    return r.table('events').getAll(r.args(ids));
}

const create = async ({ name, latitude = null, longitude = null, radius = null }) => {
    const r = getRethink();

    let location = null;
    if (longitude !== null && latitude !== null) {
        location = r.point(longitude, latitude);
    }

    const event = {
        name: name.trim(),
        location,
        radius: radius || 0,
        distance: 0,
        state: 'inactive'
    };

    if (!event.name) {
        throw new Error('Event name cannot be blank');
    }

    const eventFound = await r.table('events')
        .filter(r.row('name').downcase().eq(name.toLowerCase()))
        .nth(0)
        .default(null);

    if (eventFound) {
        throw new Error('Event name already used');
    }

    const result = await r.table('events').insert(
        r.expr(event).merge({
            createdAt: r.now()
        }),
        { returnChanges: 'always' }
    );

    return result.changes[0].new_val;
};

const onDistanceUpdate = handler => {
    const r = getRethink();

    r.table('events')
        .changes({ includeInitial: false })
        .filter(r.row('new_val')('distance').ne(r.row('old_val')('distance')))
        .run()
        .then(cursor => {
            cursor.each(async (err, record) => {
                if (err) {
                    console.error('Event.onDistanceUpdate Error: ', err);
                } else {
                    handler(record.new_val);
                }
            })
        });
};

export const Event = {
    findAll,
    findById,
    findAllById,
    create,
    onDistanceUpdate
};
