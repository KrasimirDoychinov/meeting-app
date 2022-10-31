import { CustomError } from '../errors/customError';
import { Post } from './Post';
import { PostStatus } from './internalModels/PostStatusEnums';
import { PostUpdateModel } from './internalModels/PostUpdateModel';

export class PostServices {
	static async create(
		creatorId: string,
		description: string,
		mediaUrl?: string,
		status: PostStatus = 0
	): Promise<PostUpdateModel> {
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

	static async delete(postId: string): Promise<boolean> {
		if (!postId) {
			throw new CustomError('PostId is missing', 400);
		}

		const result = await Post.deleteOne({ _id: postId });
		return result.acknowledged;
	}

	static async update(
		postId: string,
		newPost: PostUpdateModel
	): Promise<boolean> {
		if (!postId) {
			throw new CustomError('PostId is missing', 400);
		}

		console.log(newPost);
		if (Object.keys(newPost).length === 0) {
			throw new CustomError('New post details is missing', 400);
		}

		const result = await Post.updateOne(
			{ _id: postId },
			{
				description: newPost.description,
				mediaUrl: newPost.mediaUrl,
				status: newPost.status,
			},
			{ upsert: false }
		);

		return result.acknowledged;
	}
}
