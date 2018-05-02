import { Group } from '../models';
import { mustBeAdmin, mustBeOwnerOrAdmin } from './security';

export const Event = {
    groups: (event, args, ctx) => {
        mustBeAdmin(ctx);
        return Group.findAllByEventId(event.id);
    },
    latitude: (event, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.participant, participant);
        return event.location.coordinates[1];
    },
    longitude: (event, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.participant, participant);
        return event.location.coordinates[0];
    },    
};
