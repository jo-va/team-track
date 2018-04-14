import { User, Event } from '../models';
import { mustBeAdmin } from './security';

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
