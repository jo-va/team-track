import { Query } from './query';
import { Mutation } from './mutation';
import { Subscription } from './subscription';
import { User } from './user';
import { Participant } from './participant';
import { Group } from './group';
import { Event } from './event';

const resolvers = {
	Query,
	Mutation,
	Subscription,
	User,
	Participant,
	Group,
	Event
};

export default resolvers;
