import { IUser } from '../user/models/baseModels';
import { UserRepository } from '../user/userRepository';

export class TagService {
	static async setTags(userId: string, tags: [string]): Promise<boolean> {
		const user: IUser = await UserRepository.findById(userId);

		user.tags = tags;
		await user.save();
		return true;
	}
}
