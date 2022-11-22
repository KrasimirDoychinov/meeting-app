import { CommentServices } from './commentServices';

export const createComment = async (req: any, res: any) => {
	const creatorId = res.user.id;
	const postId = req.params.postId;
	const { content } = req.body;

	const post = await CommentServices.create(creatorId, postId, content);
	res.status(201).json({ post });
};

export const allByPost = async (req: any, res: any) => {
	const postId = req.params.postId;

	const posts = await CommentServices.getAllByPost(postId);
	res.status(200).json({ posts });
};

