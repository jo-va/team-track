import getRethink from '../connectors/rethink-driver';

const findAll = async () => {
    const r = getRethink();
    return r.table('users');
};

const findById = async (id) => {
    const r = getRethink();
    return r.table('users').get(id).default(null);
};

const findByIdAndVersion = async (id, version) => {
    const r = getRethink();
    return r.table('users')
        .filter({ id, version })
        .nth(0)
        .default(null);
};

const findByUsername = async (username) => {
    const r = getRethink();
    return r.table('users')
        .filter(r.row('username').downcase().eq(username.toLowerCase()))
        .nth(0)
        .default(null);
};

const addEvent = async (userId, eventId) => {
    const r = getRethink();

    const result = await r.table('users').get(userId).update({
        events: r.row('events').default([]).append(eventId)
    }, { returnChanges: 'always' });
    
    return result.changes[0].new_val;
}

const add = async ({ username, password }) => {
    const user = {
        username: username.trim(),
        password,
        events: [],
        version: 1
    };

    if (!user.username) {
        throw new Error('Username cannot be blank');
    }
    if (!password) {
        throw new Error('Password cannot be blank');
    }

    const r = getRethink();

    const userFound = await r.table('users')
        .filter(r.row('username').downcase().eq(user.username.toLowerCase()))
        .nth(0)
        .default(null);
    if (userFound) {
        throw new Error('User already exists');
    }

    const result = await r.table('users').insert(
        r.expr(user).merge({
            createdAt: r.now()
        }),
        { returnChanges: 'always' }
    );

    return result.changes[0].new_val;
};

export const User = {
    findAll,
    findById,
    findByIdAndVersion,
    findByUsername,
    addEvent,
    add
};
