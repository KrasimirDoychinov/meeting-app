import { autoInjectable } from 'tsyringe';
import { PostUpdateModel } from './models/PostUpdateModel';
import { PostServices } from './postServices';

@autoInjectable()
export default class PostController {
	private postService: PostServices;

	constructor(postService?: PostServices) {
		this.postService = postService!;
	}

	createPost = async (req: any, res: any) => {
		const userId = res.user.id;
		const { tags, description, img } = req.body;

		const post = await this.postService.create(userId, description, tags, img);
		res.status(201).json(post);
	};

	allByCreator = async (req: any, res: any) => {
		const creatorId = res.user.id;

		const posts = await this.postService.allByCreator(creatorId);
		res.status(200).json(posts);
	};

	likePost = async (req: any, res: any) => {
		const creatorId = res.user.id;
		const postId = req.params.id;

		const likes = await this.postService.like(postId, creatorId);
		res.status(200).json({ likes });
	};

	deletePost = async (req: any, res: any) => {
		const postId = req.params.id;

		const deleted = await this.postService.delete(postId);
		res.status(202).json({ deleted });
	};

	updatePost = async (req: any, res: any) => {
		const postId = req.params.id;
		const newPost: PostUpdateModel = req.body;

		const updated = await this.postService.update(postId, newPost);
		res.status(202).json({ updated });
	};
}
