import { injectable } from 'tsyringe';
import { Repository } from '../database/repository';
import { IPost } from './models/baseModels';
import { PostSchema } from './models/Post';

@injectable()
export class PostRepository extends Repository<IPost> {
	constructor() {
		super('Post', PostSchema);
	}
}
