import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { subscribe, execute } from 'graphql';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';

import schema from './schema';
import resolvers from './resolvers';
import { User, Participant } from './models';

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers
});

const app = express();

const addUser = async (req) => {
    req.user = null;
    req.participant = null;
    try {
        const bearerLength = 'Bearer '.length;
        const { authorization } = req.headers;

        if (authorization && authorization.length > bearerLength) {
            const token = authorization.slice(bearerLength);
            if (token) {
                const decoded = await jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.type === 'participant') {
                    req.participant = await Participant.findByIdAndVersion(decoded.id, decoded.version);
                    if (req.participant) {
                        req.participant.jwt = token;
                    }
                } else {
                    req.user = await User.findByIdAndVersion(decoded.id, decoded.version);
                    if (req.user) {
                        req.user.jwt = token;
                    }
                }
            }
        }
    } catch (err) {
        console.log('JWT error: ', err.message);
    }
    req.next();
};

app.use(morgan(':date[iso] - :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));
app.use(cors('*'));
app.use(addUser);

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${process.env.PORT}/subscriptions`
}));

app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress((req) => {
        return {
            schema: executableSchema,
            context: {
                user: req.user,
                participant: req.participant,
                secret: process.env.JWT_SECRET
            },
            debug: process.env.ENVIRONMENT === 'dev'
        };
    })
);

const server = createServer(app);

server.listen(process.env.PORT, (err) => {
    if (err) {
        throw err;
    }

    SubscriptionServer.create({
        schema: executableSchema,
        execute,
        subscribe,
        onConnect: () => console.log('Client connected')
    }, {
        server,
        path: '/subscriptions'
    });

    console.log(`> Server ready on http://localhost:${process.env.PORT}/graphql`);
});
