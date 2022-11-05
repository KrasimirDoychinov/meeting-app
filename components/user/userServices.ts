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

	// Friend requests

	static async sendFriendRequest(
		userToFriendId: string,
		currentUserId: string
	): Promise<boolean> {
		if (userToFriendId === currentUserId) {
			throw new CustomError('Cannot friend yourself.', 400);
		}

		const userToFriend = await User.findById(userToFriendId);
		if (userToFriend.friendNotifications.includes(currentUserId)) {
			throw new CustomError('Friend request already send', 400);
		}

		userToFriend.friendNotifications.push(currentUserId);
		await userToFriend.save();

		return true;
	}

	static async acceptFriendRequest(
		userToFriendId: string,
		currentUserId: string
	): Promise<boolean> {
		if (userToFriendId === currentUserId) {
			throw new CustomError('Cannot friend yourself.', 400);
		}

		const currentUser = await User.findById(currentUserId);
		if (currentUser.friendNotifications.includes(userToFriendId)) {
			throw new CustomError("User hasn't send friend request", 400);
		}

		currentUser.friendNotifications = currentUser.friendNotifications.filter(
			(x: string) => x !== userToFriendId
		);

		await currentUser.save();
		return true;
	}

	static async allFriendRequests(id: string): Promise<string[]> {
		const result = await User.findById(id);

		return result.friendNotifications;
	}

	// Other
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
