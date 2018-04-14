import { Group } from '../models';
import { mustBeCurrentUserOrAdmin } from './security';

export const User = {
    group: (user) => {
        return Group.findById(user.group);
    },
    jwt: (user, args, ctx) => {
        mustBeCurrentUserOrAdmin(user, ctx);
        return ctx.user.jwt;
    },
    email: (user, args, ctx) => {
        mustBeCurrentUserOrAdmin(user, ctx);
        return ctx.user.email;
    },
    isAdmin: (user, args, ctx) => {
        mustBeCurrentUserOrAdmin(user, ctx);
        return ctx.user.isAdmin;
    },
    distance: (user, args, ctx) => {
        mustBeCurrentUserOrAdmin(user, ctx);
        return ctx.user.distance;
    },
    latitude: (user, args, ctx) => {
        mustBeCurrentUserOrAdmin(user, ctx);
        return ctx.user.latitude;
    },
    longitude: (user, args, ctx) => {
        mustBeCurrentUserOrAdmin(user, ctx);
        return ctx.user.longitude;
    },
    state: (user, args, ctx) => {
        mustBeCurrentUserOrAdmin(user, ctx);
        return ctx.user.state;
    }
};
