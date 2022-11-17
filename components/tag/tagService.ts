import { CustomError } from '../errors/customError';
import { UserErrorConstants } from '../user/errors/errorConstants';
import { IUser, User } from '../user/models/User';

export class TagService {
	static async setTags(userId: string, tags: [string]): Promise<boolean> {
		const user: IUser | null = await User.findById(userId);
		if (!user) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		user.tags = tags;
		await user.save();
		return true;
	}
}
