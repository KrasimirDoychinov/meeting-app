import { CustomError } from '../errors/customError';
import { User } from './models/User';
import { UserBaseModel } from './models/output/UserBaseModel';
import { UserFullModel } from './models/output/UserFullModel';
import { ChatServices } from '../chat/chatServices';
import { io } from '../../app';

export class UserServices {
	static async byId(id: string): Promise<UserFullModel> {
		const user = await User.findById(id);
		const model: UserFullModel = {
			id: user._id,
			name: user.name,
			gender: user.gender,
			realData: {
				firstName: user.realData.firstName,
				lastName: user.realData.lastName,
				imageUrl: user.realData.imageUrl,
			},
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

		const friendRequestSend = userToFriend.friendNotifications.some(
			(x: any) => x.id === currentUserId
		);
		if (friendRequestSend) {
			throw new CustomError('Friend request already send', 400);
		}

		const currentUser = await User.findById(currentUserId);
		const usersAreFriends =
			userToFriend.friends.includes(currentUserId) &&
			currentUser.friends.includes(userToFriendId);
		if (usersAreFriends) {
			throw new CustomError('Users are already friends', 400);
		}

		userToFriend.friendNotifications.push({
			id: currentUser.id,
			name: currentUser.name,
			gender: currentUser.gender,
		});
		await userToFriend.save();
		io.emit('receive friend request', userToFriendId);

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

		const friendRequestSend = currentUser.friendNotifications.some(
			(x: any) => x.id === userToFriendId
		);
		if (!friendRequestSend) {
			throw new CustomError("User hasn't send friend request", 400);
		}

		const alreadyFriends =
			friendUser.friends.includes(currentUserId) &&
			currentUser.friends.includes(userToFriendId);
		if (alreadyFriends) {
			throw new CustomError('Users are already friends', 400);
		}

		currentUser.friendNotifications = currentUser.friendNotifications.filter(
			(x: any) => x.id !== userToFriendId
		);
		friendUser.friendNotifications = friendUser.friendNotifications.filter(
			(x: any) => x.id !== currentUserId
		);
		const chat = await ChatServices.create(currentUserId, userToFriendId);
		const result = await this.addFriends(currentUser, friendUser, chat.id);
		await currentUser.save();
		return result;
	}

	static async allFriendRequests(id: string): Promise<string[]> {
		const result = await User.findById(id);

		return result.friendNotifications;
	}

	// Chat Notifications
	static async sendChatNotification(
		currentUserId: string,
		chatId: string
	): Promise<number> {
		const user = await User.findById(currentUserId);

		user.chatNotifications.push(chatId);
		await user.save();

		return user.chatNotifications.length;
	}

	static async allChatNotifications(id: string): Promise<string[]> {
		const result = await User.findById(id);

		return result.chatNotifications;
	}

	static async changeChatAnonForUserInChat(
		chatId: string,
		id: string
	): Promise<boolean> {
		const user = await User.findById(id);

		user.friends.forEach((x: any) => {
			x.isAnon = false;
		});

		await user.save();
		return true;
	}

	// Other
	static async all(userEmail: string): Promise<UserBaseModel[]> {
		const users = await User.find({ email: { $not: { $eq: userEmail } } });
		const result: UserBaseModel[] = users.map((x: typeof User) => {
			const model: UserBaseModel = {
				id: x._id,
				name: x.name,
				gender: x.gender,
			};

			return model;
		});

		return result;
	}

	static async allWithTags(
		tags: string,
		email: string,
		userId: string
	): Promise<UserBaseModel[]> {
		const users = await User.find({
			$and: [
				{ tags: { $regex: tags } },
				{ email: { $not: { $eq: email } } },
				{
					'friends.friendId': { $not: { $regex: userId } },
				},
			],
		});
		const result: UserBaseModel[] = users.map((x: typeof User) => {
			const model: UserBaseModel = {
				id: x._id,
				name: x.name,
				tags: x.tags,
				gender: x.gender,
				friendRequestSent:
					x.friendNotifications.some((x: any) => x.id === userId) ||
					x.friends.some((x: string) => x === userId),
			};
			return model;
		});

		return result;
	}

	static async allFriends(
		userId: string,
		isChatAnon: boolean
	): Promise<UserBaseModel[]> {
		const users = await User.find({
			'friends.friendId': { $regex: userId },
		});

		const result = users.map((x: typeof User) => {
			const isChatAnon = x.friends.find(
				(x: any) => x.friendId === userId
			).isAnon;
			const model: UserBaseModel = {
				id: x._id,
				name: isChatAnon
					? x.name
					: `${x.realData.firstName} ${x.realData.lastName}`,
				tags: x.tags,
				gender: x.gender,
			};
			return model;
		});

		return result;
	}

	private static async addFriends(
		userA: typeof User,
		userB: typeof User,
		chatId: string
	): Promise<boolean> {
		if (userA === userB) {
			throw new CustomError('Cannot friend youself', 400);
		}

		userA.friends.push({ friendId: userB.id, chatId });
		userB.friends.push({ friendId: userA.id, chatId });

		await userA.save();
		await userB.save();
		return true;
	}
}
