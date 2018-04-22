import { withFilter } from 'graphql-subscriptions';
import { Group, Event } from '../models';
import pubsub from '../pubsub';

export const PARTICIPANT_JOINED = 'participantJoined';
export const GROUP_DISTANCE_UPDATED = 'groupDistanceUpdated';
export const EVENT_DISTANCE_UPDATED = 'eventDistanceUpdated';

export const subscriptionLogic = {
    async participantJoined(baseParams, args, ctx) {
        if (!ctx || !ctx.participant || !ctx.participant.group) {
            throw new Error('Unauthorized');
        }
        console.log(baseParams, args, ctx);
        baseParams.context = ctx;
        return baseParams;
    }
};

export const Subscription = {
    participantJoined: {
        subscribe: withFilter(
            () => pubsub.asyncIterator(PARTICIPANT_JOINED),
            (payload, args, ctx) => {
                //console.log(payload, args, ctx);
                //return Boolean(payload.participantJoined.group == ctx.participant.group);
                return Boolean(payload.participantJoined.group == args.group);
            }
        )
    },
    groupDistanceUpdated: {
        subscribe: withFilter(
            () => pubsub.asyncIterator(GROUP_DISTANCE_UPDATED),
            (payload, args, ctx) => {
                //console.log(payload, args, ctx);
                //return Boolean(payload.groupDistanceUpdated.id == ctx.participant.group);
                return Boolean(payload.groupDistanceUpdated.id == args.group);
            }
        )
    },
    eventDistanceUpdated: {
        subscribe: withFilter(
            () => pubsub.asyncIterator(EVENT_DISTANCE_UPDATED),
            (payload, args, ctx) => {
                //console.log(payload, args, ctx);
                //return Boolean(payload.eventDistanceUpdated.id == ctx.participant.event);
                return Boolean(payload.eventDistanceUpdated.id == args.event);
            }
        )
    }
};

Group.registerDistanceUpdatedHandler(group => {
    if (group) {
        pubsub.publish(GROUP_DISTANCE_UPDATED, { [GROUP_DISTANCE_UPDATED]: group });
    }
});

Event.registerDistanceUpdatedHandler(event => {
    if (event) {
        pubsub.publish(EVENT_DISTANCE_UPDATED, { [EVENT_DISTANCE_UPDATED]: event });
    }
});
