import { TagService } from './tagService';

export const setTags = async (req: any, res: any) => {
	const { tags } = req.body;
	const userId = res.user.id;

	const result = await TagService.setTags(userId, tags);
	res.status(201).json({ success: result });
};
