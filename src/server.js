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

const executableSchema = makeExecutableSchema({
	typeDefs: schema,
	resolvers
});

const app = express();

const addUser = async (req) => {
	const token = req.headers.authorization;
	try {
		if (token) {
			const { user } = await jwt.verify(token, process.env.JWT_SECRET);
			req.user = user;
		}
	} catch (err) {
		console.log(err);
	}
	req.next();
};

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
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
				secret: process.env.JWT_SECRET
			},
			debug: true
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
