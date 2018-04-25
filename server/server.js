import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { subscribe, execute } from 'graphql';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import morgan from 'morgan';

import schema from './schema';
import resolvers from './resolvers';
import { User, Participant } from './models';
import { getSubscriptionDetails } from './pubsub';
import { subscriptionLogic } from './resolvers/subscription';

const GRAPHQL_PORT = process.env.PORT;
const GRAPHQL_PATH = '/graphql';
const SUBSCRIPTIONS_PATH = '/subscriptions';

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers
});

const getUserOrParticipant = async (decoded, jwt) => ({
    user: decoded && decoded.type === 'user' ?
        { ...await User.findByIdAndVersion(decoded.id, decoded.version), jwt } : null,
    participant: decoded && decoded.type === 'participant' ?
        { ...await Participant.findByIdAndVersion(decoded.id, decoded.version), jwt } : null,
});

const app = express();

app.use(morgan(':date[iso] - :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));

app.use(cors('*'));

app.use('/graphql', bodyParser.json(), jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    getToken: (req) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            req.jwt = req.headers.authorization.split(' ')[1];
            return req.jwt;
        }
        return null;
      }
}), graphqlExpress(async (req) => ({
    schema: executableSchema,
    context: {
        ...await getUserOrParticipant(req.user, req.jwt),
        secret: process.env.JWT_SECRET
    },
    debug: process.env.ENVIRONMENT === 'dev'
})));

app.use('/graphiql', graphiqlExpress({
    endpointURL: GRAPHQL_PATH,
    subscriptionsEndpoint: `ws://localhost:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`
}));

const graphQLServer = createServer(app);

graphQLServer.listen(GRAPHQL_PORT, () => {
    console.log(`> GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}${GRAPHQL_PATH}`);
    console.log(`> GraphQL Subscriptions are now running on ws://localhost:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`);
});

const subscriptionServer = SubscriptionServer.create({
    schema: executableSchema,
    execute,
    subscribe
}, {
    server: graphQLServer,
    path: SUBSCRIPTIONS_PATH
});
