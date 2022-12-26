import { createClient } from 'redis';
import { RedisClientType } from '@redis/client/dist/lib/client';

let redisClient: RedisClientType;

export class RedisClient {
	constructor() {
		if (!redisClient) {
			redisClient = createClient();
			console.log('Create client hit');
		}
	}

	async connect() {
		await redisClient.connect();
	}

	async getOrSet<TReturn>(key: string, cb) {
		const data = await redisClient.get(key);
		// if (data) {
		// 	return <TReturn>JSON.parse(data);
		// }

		const newValue = await cb();
		const oldVal = await redisClient.get(key);
		console.log('NEW VAL \n', newValue);
		console.log('OLD VAL \n', JSON.parse(oldVal!) as TReturn);

		await redisClient.setEx(
			key,
			parseInt(process.env.REDIS_EXPIRATION as string),
			JSON.stringify(newValue)
		);

		return <TReturn>newValue;
	}
}
