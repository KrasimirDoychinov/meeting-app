import { autoInjectable, injectable } from 'tsyringe';
import { IUser } from '../user/models/baseModels';
import UserRepository from '../user/userRepository';

@injectable()
@autoInjectable()
export class TagService {
	private userRepo: UserRepository;

	constructor(userRepo?: UserRepository) {
		this.userRepo = userRepo!;
	}

	async setTags(userId: string, tags: [string]): Promise<boolean> {
		const user = await this.userRepo.findById(userId);

		user.tags = tags;
		await user.save();
		return true;
	}
}
