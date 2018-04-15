import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Participant, Group, Event } from '../models';
// import socket from '../socket';
import { mustBeAdmin, mustBeAuthenticated } from './security';

export const Mutation = {
    addGroup: async (root, group, ctx) => {
        mustBeAdmin(ctx);
        return Group.add(group);
    },

    addEvent: async (root, event, ctx) => {
        mustBeAdmin(ctx);
        return Event.add(event);
    },

    signup: async (root, { username, password }, ctx) => {
        const hash = await bcrypt.hash(password, 12);
        const user = await User.add({ username, password: hash });

        user.jwt = jwt.sign(
            {
                type: 'user',
                id: user.id,
                version: 1
            },
            ctx.secret,
            { expiresIn: '1w' }
        );

        ctx.user = user;

        return user;
    },

    login: async (root, { username, password }, ctx) => {
        const user = await User.findByUsername(username);
        if (!user) {
            throw new Error('Invalid username or password');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid username or password');
        }

        user.jwt = jwt.sign(
            {
                type: 'user',
                id: user.id,
                version: user.version
            },
            ctx.secret,
            { expiresIn: '1w' }
        );

        ctx.user = user;

        return user;
    },

    join: async (root, { username, secret }, ctx) => {
        // socket.publish('USER_JOINED_GROUP', { userJoinedGroup: user });
        const participant = await Participant.add(username, secret);

        participant.jwt = jwt.sign(
            {
                type: 'participant',
                id: participant.id,
                version: participant.version
            },
            ctx.secret,
            { expiresIn: '1w' }
        );

        ctx.participant = participant;

        return participant;
    },

    move: async (root, { latitude, longitude }, ctx) => {
        mustBeAuthenticated(ctx, ctx.participant);
        return Participant.move(ctx.participant.id, latitude, longitude);
    }
};
