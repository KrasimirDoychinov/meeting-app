import { autoInjectable } from 'tsyringe';
import { TagService } from './tagService';

@autoInjectable()
export default class TagController {
	tagService: TagService;

	constructor(tagService?: TagService) {
		this.tagService = tagService!;
	}

	setTags = async (req: any, res: any) => {
		const { tags } = req.body;
		const userId = res.user.id;

		const result = await this.tagService.setTags(userId, tags);
		res.status(201).json({ success: result });
	};
}
