import { CustomError } from '../errors/customError';
import { Post } from './models/Post';
import { PostStatus } from './models/enums/PostStatusEnums';
import { PostUpdateModel } from './models/input/PostUpdateModel';
import { PostReturnModel } from './models/output/PostReturnModel';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { CloudinaryHelper } from '../helpers/cloudinaryHelper';
import { PostRepository } from './postRepository';
import { autoInjectable, injectable } from 'tsyringe';
import { IPost } from './models/baseModels';

@injectable()
@autoInjectable()
export class PostServices {
	private postRepo: PostRepository;

	constructor(postRepo?: PostRepository) {
		this.postRepo = postRepo!;
	}

	async create(
		creatorId: string,
		description: string,
		tags: string[],
		img?: string,
		status: PostStatus = 0
	) {
		if (!creatorId || !description || !tags) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const post: IPost = await this.postRepo.create({
			creatorId,
			description,
			tags,
			status,
		});

		if (img) {
			const imgName = `${post._id}_p ost`;
			const imgUrl = await CloudinaryHelper.uploadImage(img, imgName);

			post.imgUrl = imgUrl;
			await post.save();
		}

		return post;
	}

	async allByTags(creatorId: string, tags: string) {
		const posts: IPost[] = await this.postRepo.find({
			$and: [{ tags: { $regex: tags } }, { creatorId: { $not: { $eq: creatorId } } }],
		});

		const result = posts.map((x: IPost) => {
			const model: PostReturnModel = {
				description: x.description,
				imageUrl: x.imageUrl,
				likes: x.likes,
			};
			return model;
		});

		return result;
	}

	async byId(id: string) {
		return await this.postRepo.findById(id);
	}

	async like(postId: string, creatorId: string) {
		if (!postId || !creatorId) {
			throw new CustomError("Id's is missing", 400);
		}

		const post: IPost = await this.postRepo.findById(postId);

		if (post.likes.includes(creatorId)) {
			post.likes = post.likes.filter((x: string) => x !== creatorId);
		} else {
			post.likes.push(creatorId);
		}

		await post.save();
		return post.likes.length;
	}

	async delete(postId: string) {
		if (!postId) {
			throw new CustomError('PostId is missing', 400);
		}

		const result = await Post.deleteOne({ _id: postId });
		return result.acknowledged;
	}

	async update(postId: string, newPost: PostUpdateModel) {
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
