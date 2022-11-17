import { Document } from 'mongoose';

export interface IRepository<TModel> {
	findById(id: string): Promise<TModel>;
	find(query: {}): Promise<TModel[]>;
}
