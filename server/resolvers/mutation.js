import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Participant, Group, Event } from '../models';
// import socket from '../socket';

const checkAuth = (user) => {
    if (!user) {
        throw new Error('You are not authenticated');
    }
};

const checkAdmin = (user) => {
    if (!user || !user.isAdmin) {
        throw new Error('You are not authorized');
    }
};

export const Mutation = {
    createGroup: async (root, group, { user }) => {
        checkAuth(user);
        checkAdmin(user);
        return Group.create(group);
    },

    createEvent: async (root, event, { user }) => {
        checkAuth(user);
        checkAdmin(user);
        return Event.create(event);
    },

    register: async (root, { username, email, password }, { secret }) => {
        const hash = await bcrypt.hash(password, 12);
        const user = await User.create({ username, email, password: hash });

        const token = jwt.sign(
            { id: user.id },
            secret,
            { expiresIn: '1w' }
        );
        return token;
    },

    login: async (root, { emailOrUsername, password }, { secret }) => {
        const user = await User.findByEmailOrUsername(emailOrUsername);
        if (!user) {
            throw new Error('User not found');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Incorrect password');
        }

        const token = jwt.sign(
            { id: user.id },
            secret,
            { expiresIn: '1w' }
        );
        return token;
    },

    participate: async (root, { secretToken }, { user }) => {
        checkAuth(user);
        // socket.publish('EVENT_CREATED', { userAdded: user });
        return Participant.create(user.id, secretToken);
    },

    updatePosition: async (root, { latitude, longitude }, { user }) => {
        checkAuth(user);
        return Participant.updatePosition(user.id, latitude, longitude);
    }
};
