import socket from '../socket';

export const Subscription = {
	userAdded: {
		subscribe: () => socket.asyncIterator('EVENT_CREATED')
	}
};
