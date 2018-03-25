import express from 'express';
import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { subscribe, execute } from 'graphql';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import schema from './schema';
import resolvers from './resolvers';

const executableSchema = makeExecutableSchema({
	typeDefs: schema,
	resolvers
});

const PORT = process.env.PORT || 5000;
const SECRET = 'asldkjfa98faf982301*@&!asdfliw';

const app = express();

const addUser = async (req) => {
	const token = req.headers.authorization;
	try {
		if (token) {
			const { user } = await jwt.verify(token, SECRET);
			req.user = user;
		}
	} catch (err) {
		console.log(err);
	}
	req.next();
};

app.use(cors('*'));
app.use(addUser);

app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
	subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}));

app.use(
	'/graphql',
	bodyParser.json(),
	graphqlExpress((req) => {
		return {
			schema: executableSchema,
			context: {
				user: req.user,
				SECRET
			},
			debug: true
		};
	})
);

const server = createServer(app);

server.listen(PORT, (err) => {
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

	console.log(`> Server ready on http://localhost:${PORT}/graphql`);
});
