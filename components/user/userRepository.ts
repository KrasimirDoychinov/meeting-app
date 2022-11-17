import { CustomError } from '../errors/customError';
import { UserErrorConstants } from './errors/errorConstants';
import { IFriend, IUser, User } from './models/User';

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

	static findFriend(friends: IFriend[], chatId: string): IFriend {
		const friend: IFriend | undefined = friends.find(
			(x: IFriend) => x.chatId === chatId
		);
		if (!friend) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		return friend;
	}
}
