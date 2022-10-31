import { PostServices } from './postServices';

export const createPost = async (req: any, res: any) => {
	const { id } = res.user;
	const { description, mediaUri } = req.body;

	const post = await PostServices.create(id, description, mediaUri);
	res.status(201).json(post);
};

export const likePost = async (req: any, res: any) => {
	const creatorId = res.user.id;
	const postId = req.params.id;

	const likes = await PostServices.like(postId, creatorId);
	res.status(200).json({ likes });
};

export const deletePost = async (req: any, res: any) => {
	const postId = req.params.id;

	await PostServices.delete(postId);
	res.status(202).json({ msg: 'Post deleted' });
};
