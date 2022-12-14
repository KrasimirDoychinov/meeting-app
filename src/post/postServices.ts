import { CustomError } from '../errors/customError';
import { Post } from './models/Post';
import { PostStatus } from './models/enums/PostStatusEnums';
import { PostReturnModel } from './models/output/PostReturnModel';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { CloudinaryHelper } from '../helpers/cloudinaryHelper';
import { PostRepository } from './postRepository';
import { autoInjectable, injectable } from 'tsyringe';
import { IPost } from './models/baseModels';
import { IUser } from '../user/models/baseModels';

@injectable()
@autoInjectable()
export class PostServices {
	private postRepo: PostRepository;

	constructor(postRepo?: PostRepository) {
		this.postRepo = postRepo!;
	}

	async create(
		user: IUser,
		description: string,
		tags: string[],
		img?: string,
		status: PostStatus = 0
	) {
		if (!user.id || !description || !tags) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const avatarUrl = await CloudinaryHelper.getAvatar();
		const post: IPost = await this.postRepo.create({
			creator: {
				id: user.id,
				name: user.name,
				imageUrl: avatarUrl,
			},
			description,
			tags,
			status,
		});

		if (img) {
			const imgName = `${post._id}_p ost`;
			const imageUrl = await CloudinaryHelper.uploadImage(img, imgName);

			post.imageUrl = imageUrl;
			await post.save();
		}

		return post;
	}

	async edit(postId: string, description: string) {
		const post = await this.postRepo.findById(postId);

		post.description = description;

		await post.save();
		return post;
	}

	async createComment(user: IUser, content: string, postId: string) {
		if (!user.id || !content || !postId) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const avatarUrl = await CloudinaryHelper.getAvatar();
		const post = await this.postRepo.findById(postId);

		const comment = {
			creator: {
				id: user.id,
				name: user.name,
				imageUrl: avatarUrl,
			},
			content,
		};
		post.comments.push(comment);

		await post.save();

		return comment;
	}

	async allByTags(creatorId: string, tags: string) {
		const posts = await this.postRepo.findAllWithTags(creatorId, tags);

		const result = posts.map((x: IPost) => {
			const model: PostReturnModel = {
				id: x.id,
				creator: {
					id: x.creator.id,
					name: x.creator.name,
					imageUrl: x.creator.imageUrl,
				},
				description: x.description,
				imageUrl: x.imageUrl,
				likes: x.likes,
				comments: x.comments,
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

		const post = await this.postRepo.findById(postId);

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
}
