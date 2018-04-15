import { User, Participant, Group, Event } from '../models';
import { mustBeAuthenticated } from './security';

export const Query = {
    currentUser: (root, args, ctx) => {
        mustBeAuthenticated(ctx, ctx.user);
        return ctx.user;
    },
    currentParticipant: (root, args, ctx) => {
        mustBeAuthenticated(ctx, ctx.participant);
        return ctx.participant;
    },    
    user: (root, { id }, ctx) => {
        mustBeAuthenticated(ctx, ctx.user);
        return User.findById(id);
    },
    users: (root, args, ctx) => {
        mustBeAuthenticated(ctx, ctx.user);
        return User.findAll();
    },
    participant: (root, { id }, ctx) => {
        mustBeAuthenticated(ctx, ctx.user);
        return Participant.findById(id);
    },
    participants: (root, args, ctx) => {
        mustBeAuthenticated(ctx, ctx.user);
        return Participant.findAll();
    },    
    group: (root, { id }, ctx) => {
        mustBeAuthenticated(ctx, ctx.user);
        return Group.findById(id);
    },
    groups: (root, args, ctx) => {
        mustBeAuthenticated(ctx, ctx.user);
        return Group.findAll();
    },
    event: (root, { id }, ctx) => {
        mustBeAuthenticated(ctx, ctx.user);
        return Event.findById(id);
    },
    events: (root, args, ctx) => {
        mustBeAuthenticated(ctx, ctx.user);
        return Event.findAll();
    }
};
