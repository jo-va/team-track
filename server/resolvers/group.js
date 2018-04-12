import { User, Event } from '../models';

const mustBeAdmin = (ctx) => {
    if (!ctx.user || !ctx.user.isAdmin) {
        throw new Error('Unauthorized');
    }
};

export const Group = {
    event: (group) => {
        return Event.findById(group.event);
    },
    users: (group) => {
        return User.findAllByGroupId(group.id);
    },
    secretToken: (group, args, ctx) => {
        mustBeAdmin(ctx);
        return group.secretToken;
    }
};
