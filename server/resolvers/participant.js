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
        return participant.latitude;
    },
    longitude: (participant, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.participant, participant);
        return participant.longitude;
    },
    state: (participant, args, ctx) => {
        mustBeOwnerOrAdmin(ctx, ctx.participant, participant);
        return participant.state;
    }
};
