import SchemaDefinition from './schema-definition.graphql';

import Query from './query.graphql';
import Mutation from './mutation.graphql';
import Subscription from './subscription.graphql';

import User from './user.graphql';
import Participant from './participant.graphql';
import Group from './group.graphql';
import Event from './event.graphql';
import LocationInput from './location-input.graphql';

export default [
    SchemaDefinition,
    Query,
    Mutation,
    Subscription,
    User,
    Participant,
    Group,
    Event,
    LocationInput
];
