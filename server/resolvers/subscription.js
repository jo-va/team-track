import socket from '../socket';

export const Subscription = {
    userJoinedGroup: {
        subscribe: () => socket.asyncIterator('USER_JOINED_GROUP')
    }
};
