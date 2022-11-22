import { CustomError } from '../errors/customError';
import { Comment } from './models/Comment';

export class CommentServices {
	static async create(creatorId: string, postId: string, content: string) {
		if (!creatorId || !postId || !content) {
			throw new CustomError('All fields are required', 400);
		}

		const post = await Comment.create({ creatorId, postId, content });
		return post;
	}

	static async getAllByPost(postId: string) {
		if (!postId) {
			throw new CustomError('PostId is missing', 400);
		}

		const comments = await Comment.find({ postId });
		return comments;
	}
}
