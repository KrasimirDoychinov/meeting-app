import { CustomError } from '../errors/customError';
import { Post } from './Post';
import { PostReturnModel } from './postModels';
import { PostStatus } from './PostStatusEnums';

export class PostServices {
	static async create(
		creatorId: string,
		description: string,
		mediaUrl?: string,
		status: PostStatus = 0
	): Promise<PostReturnModel> {
		if (!creatorId || !description) {
			throw new CustomError('CreatorId and description are required.', 400);
		}

		const post = await Post.create({
			creatorId,
			description,
			mediaUrl,
			status,
		});

		return post;
	}

	static async like(postId: string, creatorId: string): Promise<number> {
		if (!postId || !creatorId) {
			throw new CustomError("Id's is missing", 400);
		}

		const post = await Post.findById(postId);
		if (!post) {
			throw new CustomError("Post isn't found", 400);
		}

		if (post.likes.includes(creatorId)) {
			post.likes = post.likes.filter((x: string) => x !== creatorId);
		} else {
			post.likes.push(creatorId);
		}

		await post.save();
		return post.likes;
	}
}
