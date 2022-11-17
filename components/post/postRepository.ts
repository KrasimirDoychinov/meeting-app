import { CustomError } from '../errors/customError';
import { GlobalErrorConstants } from '../errors/errorConstants';
// import { IRepository } from '../global/repository';
import { IPost, Post } from './models/Post';

export class PostRepository {
	static async findById(id: string): Promise<IPost> {
		const post: IPost | null = await Post.findById(id);
		if (!post) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}
		return post;
	}
	static async find(query: {}): Promise<IPost[]> {
		const posts: IPost[] = await Post.find(query);
		if (!posts || posts.length === 0) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}

		return posts;
	}
}
