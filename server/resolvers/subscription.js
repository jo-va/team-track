import { withFilter } from 'graphql-subscriptions';
import { Participant, Group, Event } from '../models';
import pubsub from '../pubsub';

export const PARTICIPANT_JOINED = 'participantJoined';
export const GROUP_DISTANCE_UPDATED = 'groupDistanceUpdated';
export const EVENT_DISTANCE_UPDATED = 'eventDistanceUpdated';

let participantJoinedHandlerRegistered = false;
let groupDistanceHandlerRegistered = false;
let eventDistanceHandlerRegistered = false;

export const Subscription = {
    participantJoined: {
        subscribe: withFilter(
            () => {
                if (!participantJoinedHandlerRegistered) {
                    participantJoinedHandlerRegistered = true;
                    Participant.onParticipantJoined(participant => {
                        pubsub.publish(PARTICIPANT_JOINED, { [PARTICIPANT_JOINED]: participant });
                    });
                }
                return pubsub.asyncIterator(PARTICIPANT_JOINED);
            },
            (payload, args, ctx) => {
                return Boolean(payload.participantJoined.group == args.group);
            }
        )
    },
    groupDistanceUpdated: {
        subscribe: withFilter(
            () => {
                if (!groupDistanceHandlerRegistered) {
                    groupDistanceHandlerRegistered = true;
                    Group.onDistanceUpdate(group => {
                        pubsub.publish(GROUP_DISTANCE_UPDATED, { [GROUP_DISTANCE_UPDATED]: group });
                    });
                }
                return pubsub.asyncIterator(GROUP_DISTANCE_UPDATED);
            },
            (payload, args, ctx) => {
                return Boolean(payload.groupDistanceUpdated.id == args.group);
            }
        )
    },
    eventDistanceUpdated: {
        subscribe: withFilter(
            () => {
                if (!eventDistanceHandlerRegistered) {
                    eventDistanceHandlerRegistered = true;
                    Event.onDistanceUpdate(event => {
                        pubsub.publish(EVENT_DISTANCE_UPDATED, { [EVENT_DISTANCE_UPDATED]: event });
                    });
                }
                return pubsub.asyncIterator(EVENT_DISTANCE_UPDATED);
            },
            (payload, args, ctx) => {
                return Boolean(payload.eventDistanceUpdated.id == args.event);
            }
        )
    }
};
