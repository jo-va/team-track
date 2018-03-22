import express from 'express';
import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { subscribe, execute } from 'graphql';
import bodyParser from 'body-parser';
import cors from 'cors';

import schema from './schema';
import resolvers from './resolvers';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const executableSchema = makeExecutableSchema({
	typeDefs: schema,
	resolvers
});

app.use('/graphql', graphqlExpress(() => {
	return {
		schema: executableSchema,
		context: { }
	};
}));

app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
	subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}));

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
