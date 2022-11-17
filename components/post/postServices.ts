import { CustomError } from '../errors/customError';
import { IPost, Post } from './models/Post';
import { PostStatus } from './models/PostStatusEnums';
import { PostUpdateModel } from './models/PostUpdateModel';
import { PostReturnModel } from './models/PostReturnModel';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { CloudinaryHelper } from '../helpers/cloudinaryHelper';
import { PostRepository } from './postRepository';

export class PostServices {
	static async create(
		creatorId: string,
		description: string,
		tags: string[],
		img?: string,
		status: PostStatus = 0
	): Promise<IPost> {
		if (!creatorId || !description || !tags) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const post: IPost = await Post.create({
			creatorId,
			description,
			tags,
			status,
		});

		if (img) {
			const imgName = `${post._id}_post`;
			const imgUrl = await CloudinaryHelper.uploadImage(img, imgName);

			post.imgUrl = imgUrl;
			await post.save();
		}

		return post;
	}

	static async allByCreator(creatorId: string): Promise<PostReturnModel[]> {
		if (!creatorId) {
			throw new CustomError('CreatorId is missing', 400);
		}

		const posts: IPost[] = await PostRepository.find({ creatorId });
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

	static async byId(id: string): Promise<IPost> {
		return await PostRepository.findById(id);
	}

	static async like(postId: string, creatorId: string): Promise<number> {
		if (!postId || !creatorId) {
			throw new CustomError("Id's is missing", 400);
		}

		const post: IPost = await PostRepository.findById(postId);

		if (post.likes.includes(creatorId)) {
			post.likes = post.likes.filter((x: string) => x !== creatorId);
		} else {
			post.likes.push(creatorId);
		}

		await post.save();
		return post.likes.length;
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
