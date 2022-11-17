import { CustomError } from '../errors/customError';
import { UserErrorConstants } from './errors/errorConstants';
import { Friend, IUser } from './models/baseModels';
import { User } from './models/User';

export class UserRepository {
	static async findById(id: string): Promise<IUser> {
		const user: IUser | null = await User.findById(id);
		if (!user) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}
		return user!;
	}

	static async find(query: {}): Promise<IUser[]> {
		const users: IUser[] = await User.find(query);
		if (!users || users.length === 0) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		return users;
	}

	static findFriend(friends: Friend[], chatId: string): Friend {
		const friend: Friend | undefined = friends.find(
			(x: Friend) => x.chatId === chatId
		);
		if (!friend) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		return friend;
	}
}
