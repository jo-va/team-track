import socket from '../socket';

export const Subscription = {
    participantAdded: {
        subscribe: () => socket.asyncIterator('EVENT_CREATED')
    }
};
