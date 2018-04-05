import { Participant, Event } from '../models';

export const Group = {
    event: (group) => {
        return Event.findById(group.event);
    },
    participants: (group) => {
        return Participant.findAllByGroupId(group.id);
    }
};
