import { CustomError } from '../errors/customError';
import { User } from './models/User';
import { FriendModel, UserBaseModel } from './models/output/UserBaseModel';
import { UserFullModel } from './models/output/UserFullModel';
import { ChatServices } from '../chat/chatServices';
import { io } from '../../app';
import { GlobalErrorHelper } from '../errors/errorHelper';
import { UserErrorConstants } from './errors/errorConstants';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { HelperConstants } from '../helpers/helperConstants';
import { Chat } from '../chat/models/Chat';

export class UserServices {
	static async setRealData(
		id: string,
		firstName: string,
		lastName: string,
		img: any
	): Promise<boolean> {
		const user = await User.findById(id);
		if (GlobalErrorHelper.areFieldsNotNull([user])) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		if (GlobalErrorHelper.areFieldsNotNull([firstName, lastName, img])) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const fs = require('fs');
		const imageName = `${firstName}_${lastName}_${user.id}.png`;
		fs.writeFile(`./static/${imageName}`, img.data, () => {});

		user.realData = {
			firstName,
			lastName,
			imageName,
		};

		await user.save();
		return true;
	}

	static async byId(id: string): Promise<UserFullModel> {
		const user = await User.findById(id);
		if (GlobalErrorHelper.areFieldsNotNull([user])) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		const model: UserFullModel = {
			id: user._id,
			name: user.name,
			gender: user.gender,
			realData: {
				firstName: user.realData.firstName,
				lastName: user.realData.lastName,
				imageName: `${HelperConstants.imagesPath}${user.realData.imageName}`,
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
			throw new CustomError(UserErrorConstants.CannotFriendSelf, 400);
		}

		const userToFriend = await User.findById(userToFriendId);

		const friendRequestSend = userToFriend.friendNotifications.some(
			(x: any) => x.id === currentUserId
		);
		if (friendRequestSend) {
			throw new CustomError(UserErrorConstants.FriendRequestAlreadySent, 400);
		}

		const currentUser = await User.findById(currentUserId);
		const usersAreFriends =
			userToFriend.friends.includes(currentUserId) &&
			currentUser.friends.includes(userToFriendId);
		if (usersAreFriends) {
			throw new CustomError(UserErrorConstants.AlreadyFriends, 400);
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
			throw new CustomError(UserErrorConstants.CannotFriendSelf, 400);
		}

		const currentUser = await User.findById(currentUserId);
		const friendUser = await User.findById(userToFriendId);

		const friendRequestSend = currentUser.friendNotifications.some(
			(x: any) => x.id === userToFriendId
		);
		if (!friendRequestSend) {
			throw new CustomError(UserErrorConstants.FriendRequestNotSent, 400);
		}

		const alreadyFriends =
			friendUser.friends.includes(currentUserId) &&
			currentUser.friends.includes(userToFriendId);
		if (alreadyFriends) {
			throw new CustomError(UserErrorConstants.AlreadyFriends, 400);
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
		const user = await User.findById(id);
		if (GlobalErrorHelper.areFieldsNotNull([user])) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		return user.friendNotifications;
	}

	// Chat Notifications
	static async sendChatNotification(
		currentUserId: string,
		chatId: string
	): Promise<any> {
		const user = await User.findById(currentUserId);
		if (GlobalErrorHelper.areFieldsNotNull([user])) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		const currentFriend = user.friends.find((x: any) => x.chatId === chatId);
		currentFriend.notifications += 1;
		await user.save();

		io.emit('chat notifications', currentFriend.notifications);
		return {
			notifications: currentFriend.notifications,
			userId: currentUserId,
		};
	}

	static async allChatNotifications(id: string): Promise<number> {
		const user = await User.findById(id);
		if (GlobalErrorHelper.areFieldsNotNull([user])) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		const notifications =
			user.friends.length === 0
				? 0
				: user.friends
						.map((x: any) => x.notifications)
						.reduce((a: number, b: number) => a + b);

		return notifications;
	}

	static async changeChatAnonForUserInChat(
		chatId: string,
		id: string
	): Promise<boolean> {
		const user = await User.findById(id);
		if (GlobalErrorHelper.areFieldsNotNull([user])) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		user.friends.forEach((x: any) => {
			x.isAnon = false;
		});

		await user.save();
		return true;
	}

	// Other
	static async all(userEmail: string): Promise<UserBaseModel[]> {
		const users = await User.find({ email: { $not: { $eq: userEmail } } });
		if (GlobalErrorHelper.areFieldsNotNull([users])) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		const result: UserBaseModel[] = users.map((x: typeof User) => {
			const model: UserBaseModel = {
				id: x._id,
				name: x.name,
				gender: x.gender,
				imageName: `${HelperConstants.imagesPath}${x.realData.imageName}`,
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
		if (GlobalErrorHelper.areFieldsNotNull([users])) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		const result: UserBaseModel[] = users.map((x: typeof User) => {
			const model: UserBaseModel = {
				id: x._id,
				name: x.name,
				tags: x.tags,
				gender: x.gender,
				friendRequestSent:
					x.friendNotifications.some((x: any) => x.id === userId) ||
					x.friends.some((x: string) => x === userId),
				imageName: `${HelperConstants.imagesPath}avatar.png`,
			};
			return model;
		});

		return result;
	}

	static async allFriends(
		userId: string,
		isChatAnon: boolean
	): Promise<FriendModel[]> {
		const users = await User.findById(userId);
		if (GlobalErrorHelper.areFieldsNotNull([users])) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		const result: FriendModel[] = users.friends.map((x: any) => {
			const model: FriendModel = {
				id: x._id,
				name: x.isAnon
					? x.name
					: `${x.realData.firstName} ${x.realData.lastName}`,
				gender: x.gender,
				imageName: x.isAnon
					? `${HelperConstants.imagesPath}avatar.png`
					: `${HelperConstants.imagesPath}${x.realData.imageName}`,
				notificationCount: x.notifications,
				chatId: x.chatId,
			};
			return model;
		});

		console.log(result);
		return result;
	}

	private static async addFriends(
		userA: typeof User,
		userB: typeof User,
		chatId: string
	): Promise<boolean> {
		if (userA.id === userB.id) {
			throw new CustomError(UserErrorConstants.CannotFriendSelf, 400);
		}

		userA.friends.push({
			friendId: userB.id,
			name: userB.name,
			imageName: userB.imageName,
			chatId,
		});
		userB.friends.push({
			friendId: userA.id,
			name: userA.name,
			imageName: userA.imageName,
			chatId,
		});

		await userA.save();
		await userB.save();
		return true;
	}
}
