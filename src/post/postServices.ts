import { CustomError } from '../errors/customError';
import { IPost, Post } from './models/Post';
import { PostStatus } from './models/enums/PostStatusEnums';
import { PostUpdateModel } from './models/input/PostUpdateModel';
import { PostReturnModel } from './models/output/PostReturnModel';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { CloudinaryHelper } from '../helpers/cloudinaryHelper';
import { PostRepository } from './postRepository';
import { autoInjectable, injectable } from 'tsyringe';

@injectable()
@autoInjectable()
export class PostServices {
	private postRepo: PostRepository;

	constructor(postRepo?: PostRepository) {
		this.postRepo = postRepo!;
	}

	async create(creatorId: string, description: string, tags: string[], img?: string, status: PostStatus = 0): Promise<IPost> {
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

	async allByCreator(creatorId: string): Promise<PostReturnModel[]> {
		if (!creatorId) {
			throw new CustomError('CreatorId is missing', 400);
		}

		const posts: IPost[] = await this.postRepo.find({ creatorId });
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

	async byId(id: string): Promise<IPost> {
		return await this.postRepo.findById(id);
	}

	async like(postId: string, creatorId: string): Promise<number> {
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

	async delete(postId: string): Promise<boolean> {
		if (!postId) {
			throw new CustomError('PostId is missing', 400);
		}

		const result = await Post.deleteOne({ _id: postId });
		return result.acknowledged;
	}

	async update(postId: string, newPost: PostUpdateModel): Promise<boolean> {
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
