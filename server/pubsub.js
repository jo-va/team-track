import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

let pubsub;

const getPubSub = () => {
    if (!pubsub) {
        pubsub = new RedisPubSub({
            connection: process.env.REDIS_URL
        });
    }
    return pubsub;
}

export default getPubSub;
