import { Participant, Event } from '../models';
import { mustBeAdmin } from './security';

export const Group = {
    event: (group) => {
        return Event.findById(group.event);
    },
    participants: (group) => {
        return Participant.findAllByGroupId(group.id);
    },
    secret: (group, args, ctx) => {
        mustBeAdmin(ctx);
        return group.secret;
    }
};
