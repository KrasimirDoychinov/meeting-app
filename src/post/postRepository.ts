import { injectable } from 'tsyringe';
import { Repository } from '../database/repository';
import { CustomError } from '../errors/customError';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { IPost } from './models/baseModels';
import { Post, PostSchema } from './models/Post';

@injectable()
export class PostRepository extends Repository<IPost> {
	constructor() {
		super('Post', PostSchema);
	}

	async findAllWithTags(creatorId: string, tags: string) {
		const posts: IPost[] = await Post.find({
			$and: [{ tags: { $regex: tags } }, { 'creator.id': { $not: { $eq: creatorId } } }],
		}).sort({ createdOn: -1 });

		if (posts.length <= 0) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}

		return posts;
	}

	async findAllForUser(creatorId: string) {
		const posts: IPost[] = await Post.find({ 'creator.id': creatorId }).sort({
			createdOn: -1,
		});

		return posts;
	}
}
