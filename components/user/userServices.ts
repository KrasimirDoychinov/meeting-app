import { CustomError } from '../errors/customError';
import { User } from './models/User';
import { UserAnonData } from './models/UserAnonData';
import { UserFullData } from './models/UserFullData';

export class UserServices {
	static async byId(id: string): Promise<UserFullData> {
		const user = await User.findById(id);
		const model: UserFullData = {
			id: user._id,
			name: user.name,
			gender: user.gender,
			realData: {
				firstName: user.realData.firstName,
				lastName: user.realData.lastName,
				imageUrl: user.realData.imageUrl,
			},
			messages: user.messages,
		};
		return model;
	}

	static async addFriend(
		userToFriendId: string,
		currentUserId: string
	): Promise<Boolean> {
		if (userToFriendId === currentUserId) {
			throw new CustomError('Cannot friend yourself.', 400);
		}

		const currentUser = await User.findById(currentUserId);

		if (currentUser.friends.includes(userToFriendId)) {
			throw new CustomError('This user is already friended', 400);
		}

		currentUser.friends.push(userToFriendId);
		await currentUser.save();

		return true;
	}

	static async all(userEmail: string): Promise<UserAnonData[]> {
		const users = await User.find({ email: { $not: { $eq: userEmail } } });
		const result = users.map((x: typeof User) => {
			const model: UserAnonData = {
				id: x._id,
				name: x.name,
				gender: x.gender,
				messages: [],
			};

			return model;
		});

		return result;
	}
}
