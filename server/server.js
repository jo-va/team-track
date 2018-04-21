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

const getUserOrParticipant = async (decoded) => ({
    user: decoded && decoded.type === 'user' ?
        await User.findByIdAndVersion(decoded.id, decoded.version) : null,
    participant: decoded && decoded.type === 'participant' ?
        await Participant.findByIdAndVersion(decoded.id, decoded.version) : null,
});

const app = express();

app.use(morgan(':date[iso] - :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));

app.use(cors('*'));

app.use('/graphql', bodyParser.json(), jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false
}), graphqlExpress(async (req) => ({
    schema: executableSchema,
    context: {
        ...await getUserOrParticipant(req.user),
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
    subscribe,
    onConnect: async (connectionParams, webSocket) => {
        console.log(connectionParams);
        if (connectionParams.jwt) {
            const decoded = await jsonwebtoken.verify(connectionParams.jwt, process.env.JWT_SECRET);
            return getUserOrParticipant(decoded);
        }
    },
    onOperation: async (parsedMessage, baseParams) => {
        const { subscriptionName, args } = getSubscriptionDetails({
            baseParams,
            schema: executableSchema
        });

        return subscriptionLogic[subscriptionName](baseParams, args, baseParams.context);
    }
}, {
    server: graphQLServer,
    path: SUBSCRIPTIONS_PATH
});
