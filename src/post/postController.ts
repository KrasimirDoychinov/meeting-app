import { AnyMxRecord } from 'dns';
import { autoInjectable } from 'tsyringe';
import UserRepository from '../user/userRepository';
import { PostUpdateModel } from './models/input/PostUpdateModel';
import { PostServices } from './postServices';

@autoInjectable()
export default class PostController {
	private postService: PostServices;
	private userRepo: UserRepository;

	constructor(postService?: PostServices, userRepo?: UserRepository) {
		this.postService = postService!;
		this.userRepo = userRepo!;
	}

	createPost = async (req: any, res: any) => {
		const userId = res.user.id;
		const { tags, description, img } = req.body;

		const user = await this.userRepo.findById(userId);
		const post = await this.postService.create(user, description, tags, img);
		res.status(201).json(post);
	};

	createComment = async (req: any, res: any) => {
		const userId = res.user.id;
		const postId = res.params.id;
		const { content } = req.body;

		const user = await this.userRepo.findById(userId);
		const comment = await this.postService.createComment(user, content, postId);

		res.status(201).json(comment);
	};

	allByTags = async (req: any, res: any) => {
		const creatorId = res.user.id;
		const tags = req.query.tags;

		const posts = await this.postService.allByTags(creatorId, tags);
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
