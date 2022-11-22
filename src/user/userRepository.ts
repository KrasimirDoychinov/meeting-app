import 'express-async-errors';

import { injectable } from 'tsyringe';
import { CustomError } from '../errors/customError';
import { Repository } from '../global/repository';
import { UserErrorConstants } from './errors/errorConstants';
import { Friend, IUser } from './models/baseModels';
import { UserSchema } from './models/User';

@injectable()
export default class UserRepository extends Repository<IUser> {
	constructor() {
		super('User', UserSchema);
	}

	findFriend(friends: Friend[], chatId: string): Friend {
		const friend: Friend | undefined = friends.find((x: Friend) => x.chatId === chatId);
		if (!friend) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		return friend;
	}
}
