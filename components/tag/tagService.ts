import { autoInjectable } from 'tsyringe';
import { IUser } from '../user/models/baseModels';
import UserRepository from '../user/userRepository';

@autoInjectable()
export class TagService {
	userRepo: UserRepository;
	constructor(userRepo?: UserRepository) {
		this.userRepo = userRepo!;
	}

	async setTags(userId: string, tags: [string]): Promise<boolean> {
		const user: IUser = await this.userRepo.findById(userId);

		user.tags = tags;
		await user.save();
		return true;
	}
}
