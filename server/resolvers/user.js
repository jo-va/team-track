import { mustBeOwnerOrAdmin } from './security';

export const User = {
    jwt: (user, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.user, user);
        return ctx.user.jwt;
    },
    isAdmin: (user, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.user, user);
        return ctx.user.isAdmin;
    }
};
