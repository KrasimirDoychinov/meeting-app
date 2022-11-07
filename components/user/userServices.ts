import { CustomError } from '../errors/customError';
import { User } from './models/User';
import { UserAnonData } from './models/UserAnonData';
import { UserFullData } from './models/UserFullData';
import { addToFriend } from './userController';

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

	// currentUser sends request to userToFriend
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

		const currentUser = await User.findById(currentUserId);
		userToFriend.friendNotifications.push({
			id: currentUser.id,
			name: currentUser.name,
			gender: currentUser.gender,
		});
		await userToFriend.save();

		return true;
	}

	// currentUser accepts userToFriend and they become friends
	static async acceptFriendRequest(
		userToFriendId: string,
		currentUserId: string
	): Promise<boolean> {
		if (userToFriendId === currentUserId) {
			throw new CustomError('Cannot friend yourself.', 400);
		}

		const currentUser = await User.findById(currentUserId);
		const friendUser = await User.findById(userToFriendId);
		const friendRequestSend = friendUser.friendNotifications.some(
			(x: any) => x.id === userToFriendId
		);
		if (friendRequestSend) {
			throw new CustomError("User hasn't send friend request", 400);
		}

		currentUser.friendNotifications = currentUser.friendNotifications.filter(
			(x: any) => x.id !== userToFriendId
		);

		const result = await this.addFriends(currentUser, friendUser);
		await currentUser.save();
		return result;
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

	private static async addFriends(
		userA: typeof User,
		userB: typeof User
	): Promise<boolean> {
		if (userA === userB) {
			throw new CustomError('Cannot friend youself', 400);
		}

		userA.friends.push(userB.id);
		userB.friends.push(userA.id);

		await userA.save();
		await userB.save();
		return true;
	}
}
