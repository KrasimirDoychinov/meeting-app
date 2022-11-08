import { CustomError } from '../errors/customError';
import { Post } from './models/Post';
import { PostStatus } from './models/PostStatusEnums';
import { PostUpdateModel } from './models/PostUpdateModel';
import { PostReturnModel } from './models/PostReturnModel';

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

	static async allByCreator(creatorId: string): Promise<PostReturnModel[]> {
		if (!creatorId) {
			throw new CustomError('CreatorId is missing', 400);
		}

		const posts = await Post.find({ creatorId });
		const result = posts.map((x: any) => {
			const model: PostReturnModel = {
				description: x.description,
				mediaUrl: x.mediaUrl,
				status: x.status,
				likes: x.likes,
			};
			return model;
		});

		return result;
	}

	static async byId(id: string) {
		return await Post.findById(id);
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
