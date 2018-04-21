import { Event } from '../models';
import { mustBeOwner } from './security';

export const User = {
    jwt: (user, args, ctx) => {
        mustBeOwner(ctx, ctx.user, user);
        return ctx.user.jwt;
    },
    events: (user, args, ctx) => {
        mustBeOwner(ctx, ctx.user, user);
        return Event.findAllById(ctx.user.events);
    }
};
