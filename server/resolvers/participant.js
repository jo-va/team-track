import { Group, Event } from '../models';
import { mustBeOwner, mustBeOwnerOrAdmin } from './security';

export const Participant = {
    group: (participant) => {
        return Group.findById(participant.group);
    },
    event: (participant) => {
        return Event.findById(participant.event);
    },
    jwt: (participant, args, ctx) => {
        mustBeOwner(ctx, ctx.participant, participant);
        return ctx.participant.jwt;
    },
    distance: (participant, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.participant, participant);
        return participant.distance;
    },
    latitude: (participant, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.participant, participant);
        return participant.location.coordinates[1];
    },
    longitude: (participant, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.participant, participant);
        return participant.location.coordinates[0];
    },
    isActive: (participant, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.participant, participant);
        return participant.isActive;
    },
    isOutOfRange: (participant, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.participant, participant);
        return participant.isOutOfRange;
    }    
};
