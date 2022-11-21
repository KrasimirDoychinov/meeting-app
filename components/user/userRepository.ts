import 'express-async-errors';
import mongoose from 'mongoose';

import { injectable } from 'tsyringe';
import { CustomError } from '../errors/customError';
import { Repository } from '../global/repository';
import { UserErrorConstants } from './errors/errorConstants';
import { Friend, IUser } from './models/baseModels';

@injectable()
export class UserRepository extends Repository<IUser> {
	constructor() {
		super('User');
	}

	findFriend(friends: Friend[], chatId: string): Friend {
		const friend: Friend | undefined = friends.find((x: Friend) => x.chatId === chatId);
		if (!friend) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		return friend;
	}
}
