import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { subscribe, execute } from 'graphql';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';

import schema from './schema';
import resolvers from './resolvers';
import { User, Participant } from './models';
import { getSubscriptionDetails } from './pubsub';
import { subscriptionLogic } from './resolvers/subscription';

const GRAPHQL_PORT = process.env.PORT;
const GRAPHQL_PATH = '/graphql';
const GRAPHIQL_PATH = '/graphiql';
const SUBSCRIPTIONS_PATH = '/subscriptions';

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers
});

const jwtMiddleware = async (req) => {
    req.jwt = null;
    req.decoded = null;

    const bearerLength = 'Bearer '.length;
    const { authorization } = req.headers;

    try {
        if (authorization && authorization.length > bearerLength) {
            const token = authorization.slice(bearerLength);
            if (token) {
                req.decoded = await jwt.verify(token, process.env.JWT_SECRET);
                req.jwt = token;
            }
        }
    } catch (err) {
        console.log('JWT error: ', err.message);
    }
    req.next();
};

const getUserOrParticipant = async (decoded, jwt) => {
    let result = {
        user: null,
        participant: null
    };

    if (decoded && decoded.type === 'user') {
        result.user = await User.findByIdAndVersion(decoded.id, decoded.version);
        if (result.user) {
            result.user.jwt = jwt;
        }
    } else if (decoded && decoded.type === 'participant') {
        result.participant = await Participant.findByIdAndVersion(decoded.id, decoded.version);
        if (result.participant) {
            result.participant.jwt = jwt;
        }
    }

    return result;
};

const app = express();

app.use(morgan(':date[iso] - :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));

app.use(GRAPHQL_PATH,
    bodyParser.json(),
    jwtMiddleware,
    graphqlExpress(async (req) => ({
        schema: executableSchema,
        context: {
            ...await getUserOrParticipant(req.decoded, req.jwt),
            secret: process.env.JWT_SECRET
        },
        debug: process.env.ENVIRONMENT === 'dev'
    })
));

app.use(GRAPHIQL_PATH, graphiqlExpress({
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
    onConnect: async (params, socket, ctx) => {
        console.log('** Connected');
        if (params.jwt) {
            const decoded = await jwt.verify(params.jwt, process.env.JWT_SECRET);
            const res = await getUserOrParticipant(decoded, params.jwt);
            console.log(res.user ? res.user.username : (res.participant ? res.participant.username : ''));
        }
    },
    onDisconnect: async (params, socket, ctx) => {
        console.log('** Disconnected');
    }
}, {
    server: graphQLServer,
    path: SUBSCRIPTIONS_PATH
});
