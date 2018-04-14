import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Group, Event } from '../models';
// import socket from '../socket';
import { mustBeAdmin, mustBeAuthenticated } from './security';

export const Mutation = {
    createGroup: async (root, group, ctx) => {
        mustBeAdmin(ctx);
        return Group.create(group);
    },

    createEvent: async (root, event, ctx) => {
        mustBeAdmin(ctx);
        return Event.create(event);
    },

    signup: async (root, { username, email, password }, ctx) => {
        const hash = await bcrypt.hash(password, 12);
        const user = await User.create({ username, email, password: hash });

        user.jwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
                version: 1
            },
            ctx.secret,
            { expiresIn: '1w' }
        );

        ctx.user = user;

        return user;
    },

    login: async (root, { emailOrUsername, password }, ctx) => {
        const user = await User.findByEmailOrUsername(emailOrUsername);
        if (!user) {
            throw new Error('Invalid username or password');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid username or password');
        }

        user.jwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
                version: user.version
            },
            ctx.secret,
            { expiresIn: '1w' }
        );

        ctx.user = user;

        return user;
    },

    join: async (root, { secretToken }, ctx) => {
        mustBeAuthenticated(ctx);
        // socket.publish('USER_JOINED_GROUP', { userJoinedGroup: user });
        return User.joinGroup(ctx.user.id, secretToken);
    },

    move: async (root, { latitude, longitude }, ctx) => {
        mustBeAuthenticated(ctx);
        return User.updatePosition(ctx.user.id, latitude, longitude);
    }
};