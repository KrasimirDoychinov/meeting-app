import { PostUpdateModel } from './internalModels/PostUpdateModel';
import { PostServices } from './postServices';

export const createPost = async (req: any, res: any) => {
	const userId = res.user.id;
	const { description, mediaUri, status } = req.body;

	const post = await PostServices.create(userId, description, mediaUri, status);
	res.status(201).json(post);
};

export const allByCreator = async (req: any, res: any) => {
	const creatorId = res.user.id;

	const posts = await PostServices.allByCreator(creatorId);
	res.status(200).json(posts);
};

export const likePost = async (req: any, res: any) => {
	const creatorId = res.user.id;
	const postId = req.params.id;

	const likes = await PostServices.like(postId, creatorId);
	res.status(200).json({ likes });
};

export const deletePost = async (req: any, res: any) => {
	const postId = req.params.id;

	const deleted = await PostServices.delete(postId);
	res.status(202).json({ deleted });
};

export const updatePost = async (req: any, res: any) => {
	const postId = req.params.id;
	const newPost: PostUpdateModel = req.body;

	const updated = await PostServices.update(postId, newPost);
	res.status(202).json({ updated });
};
