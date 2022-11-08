import { User } from '../user/models/User';

export class TagService {
	static async setTags(userId: string, tags: [string]): Promise<boolean> {
		const user = await User.findById(userId);

		user.tags = tags;
		await user.save();
		return true;
	}
}
