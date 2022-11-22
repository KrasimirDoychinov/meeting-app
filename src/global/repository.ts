import mongoose, { Document } from 'mongoose';
import { CustomError } from '../errors/customError';
import { GlobalErrorConstants } from '../errors/errorConstants';

export interface IRepository<TReturn extends Document> {
	create(entity: {}): Promise<TReturn>;
	findById(id: string): Promise<TReturn>;
	find(query: {}): Promise<TReturn[]>;
	findOne(query: {}): Promise<TReturn>;
}

export class Repository<TReturn extends Document> implements IRepository<TReturn> {
	private model: string;
	constructor(model: string) {
		this.model = model;
	}

	async create(entity: {}): Promise<TReturn extends Document<any, any, any> ? any : any> {
		return await mongoose.model(this.model).create(entity);
	}

	async findById(id: string): Promise<TReturn extends Document<any, any, any> ? any : any> {
		const entity: TReturn | null = await mongoose.model(this.model).findById(id);
		if (!entity) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}
		return entity!;
	}

	async find(query: {}): Promise<(TReturn extends Document<any, any, any> ? any : any)[]> {
		const entities: TReturn[] | null = await mongoose.model(this.model).find(query);
		if (entities.length <= 0) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}
		return entities!;
	}

	async findOne(query: {}): Promise<TReturn extends Document<any, any, any> ? any : any> {
		const entity: TReturn | null = await mongoose.model(this.model).findOne(query);
		if (!entity) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}
		return entity!;
	}
}
