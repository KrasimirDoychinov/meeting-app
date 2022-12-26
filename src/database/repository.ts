import mongoose, { Document } from 'mongoose';
import { CustomError } from '../errors/customError';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { RedisClient } from './redisClient';

export class Repository<TReturn extends Document> {
	private model: string;
	private schema: any;
	private redisClient: RedisClient;

	constructor(model: string, schema) {
		this.model = model;
		this.schema = schema;

		this.redisClient = new RedisClient();
	}

	async create(entity: {}): Promise<TReturn | any> {
		return await mongoose.model(this.model, this.schema).create(entity);
	}

	async findById(id: string): Promise<TReturn> {
		const entity: TReturn | null = await this.redisClient.getOrSet<TReturn>(
			`${this.model}?id=${id}`,
			async () => {
				return await mongoose.model(this.model, this.schema).findById(id);
			}
		);

		if (!entity) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}

		return entity;
	}

	async find(query: {}): Promise<TReturn[]> {
		const entities = await this.redisClient.getOrSet<TReturn[]>(
			JSON.stringify(query),
			async () => {
				return await mongoose.model(this.model, this.schema).find(query);
			}
		);

		if (entities.length <= 0) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}

		return entities;
	}

	async findOne(query: {}): Promise<TReturn> {
		const entity: TReturn | null = await this.redisClient.getOrSet<TReturn>(
			JSON.stringify(query),
			async () => {
				return await mongoose.model(this.model, this.schema).findOne(query);
			}
		);

		if (!entity) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}

		return entity;
	}
}
