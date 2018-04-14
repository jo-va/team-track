import { User, Group, Event } from '../models';
import { mustBeAuthenticated } from './security';

export const Query = {
    me: (root, args, ctx) => {
        mustBeAuthenticated(ctx);
        return ctx.user;
    },
    user: (root, { id }, ctx) => {
        mustBeAuthenticated(ctx);
        return User.findById(id);
    },
    users: (root, args, ctx) => {
        mustBeAuthenticated(ctx);
        return User.findAll();
    },
    group: (root, { id }, ctx) => {
        mustBeAuthenticated(ctx);
        return Group.findById(id);
    },
    groups: (root, args, ctx) => {
        mustBeAuthenticated(ctx);
        return Group.findAll();
    },
    event: (root, { id }, ctx) => {
        mustBeAuthenticated(ctx);
        return Event.findById(id);
    },
    events: (root, args, ctx) => {
        mustBeAuthenticated(ctx);
        return Event.findAll();
    }
};
