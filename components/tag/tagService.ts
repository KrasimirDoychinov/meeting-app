import { CustomError } from '../errors/customError';
import { GlobalErrorHelper } from '../errors/errorHelper';
import { UserErrorConstants } from '../user/errors/errorConstants';
import { User } from '../user/models/User';

export class TagService {
	static async setTags(userId: string, tags: [string]): Promise<boolean> {
		const user = await User.findById(userId);
		if (GlobalErrorHelper.areFieldsNotNull([user])) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		user.tags = tags;
		await user.save();
		return true;
	}
}
