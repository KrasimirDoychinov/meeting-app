import 'express-async-errors';

import { injectable } from 'tsyringe';
import { CustomError } from '../errors/customError';
import { IRepository } from '../global/repository';
import { UserErrorConstants } from './errors/errorConstants';
import { Friend, IUser } from './models/baseModels';
import { User } from './models/User';

@injectable()
export default class UserRepository implements IRepository<IUser> {
	async findById(id: string): Promise<IUser> {
		const user: IUser | null = await User.findById(id);
		if (!user) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}
		return user!;
	}

	async find(query: {}): Promise<IUser[]> {
		const users: IUser[] = await User.find(query);
		if (!users || users.length === 0) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		return users;
	}

	async findOne(query: {}): Promise<IUser> {
		const user: IUser | null = await User.findOne(query);
		if (!user) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		return user;
	}

	findFriend(friends: Friend[], chatId: string): Friend {
		const friend: Friend | undefined = friends.find(
			(x: Friend) => x.chatId === chatId
		);
		if (!friend) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		return friend;
	}
}
