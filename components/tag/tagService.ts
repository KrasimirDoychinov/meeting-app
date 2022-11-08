import { User } from '../user/models/User';

export class TagService {
	static async setTags(userId: string, tags: [string]): Promise<boolean> {
		const user = await User.findById(userId);

		console.log(user, tags);
		user.tags = tags;
		console.log(user);
		await user.save();
		return true;
	}
}
