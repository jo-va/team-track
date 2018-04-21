import { withFilter } from 'graphql-subscriptions';
import pubsub from '../pubsub';

export const PARTICIPANT_JOINED = 'participantJoined';
export const GROUP_DISTANCE_UPDATED = 'groupDistanceUpdated';

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
                console.log(payload, args, ctx);
                return Boolean(payload.participantJoined.group == ctx.participant.group);
            }
        )
    },
    groupDistanceUpdated: {
        subscribe: withFilter(
            () => pubsub.asyncIterator(GROUP_DISTANCE_UPDATED),
            (payload, args, ctx) => {
                console.log(payload, args, ctx);
                return Boolean(payload.groupDistanceUpdated.id == ctx.participant.group);
            }
        )
    }
};
