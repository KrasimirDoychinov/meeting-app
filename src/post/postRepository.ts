import { injectable } from 'tsyringe';
import { Repository } from '../global/repository';
import { IPost } from './models/Post';

@injectable()
export class PostRepository extends Repository<IPost> {
	constructor() {
		super('Post');
	}
}
