import { CustomError } from '../errors/customError';

import { FriendViewModel, UserBaseModel, UserFullViewModelModel } from './models/output/outputModels';

import { io } from '../../app';
import { UserErrorConstants } from './errors/errorConstants';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { CloudinaryHelper } from '../helpers/cloudinaryHelper';
import { Friend, FriendNotification, IUser } from './models/baseModels';

import { UserRepository } from './userRepository';
import { autoInjectable, injectable } from 'tsyringe';

@injectable()
@autoInjectable()
export class UserServices {
	private userRepo: UserRepository;

	constructor(userRepo?: UserRepository) {
		this.userRepo = userRepo!;
	}

	async setRealData(id: string, firstName: string, lastName: string, img: string): Promise<boolean> {
		const user = await this.userRepo.findById(id);

		if (!firstName || !lastName || !img) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const imageName = `${firstName}_${lastName}_${user.id}`;
		const imageUrl = await CloudinaryHelper.uploadImage(img, imageName);

		user.realData = {
			firstName,
			lastName,
			imageUrl,
		};

		await user.save();
		return true;
	}

	async byId(id: string): Promise<UserFullViewModelModel> {
		const user: IUser = await this.userRepo.findById(id);

		const model: UserFullViewModelModel = {
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
	async sendFriendRequest(userToFriendId: string, currentUserId: string): Promise<boolean> {
		if (userToFriendId === currentUserId) {
			throw new CustomError(UserErrorConstants.CannotFriendSelf, 400);
		}

		const currentUser: IUser = await this.userRepo.findById(currentUserId);
		const friendUser: IUser = await this.userRepo.findById(userToFriendId);

		const friendRequestSend = friendUser.friendNotifications.some((x: any) => x.friendId === currentUserId);
		if (friendRequestSend) {
			throw new CustomError(UserErrorConstants.FriendRequestAlreadySent, 400);
		}

		if (this.areFriends(currentUser, friendUser)) {
			throw new CustomError(UserErrorConstants.AlreadyFriends, 400);
		}

		friendUser.friendNotifications.push({
			friendId: currentUser.id,
			name: currentUser.name,
		});
		await friendUser.save();
		io.emit('receive friend request', friendUser.id);

		return true;
	}

	// currentUser accepts userToFriend and they become friends
	async acceptFriendRequest(userToFriendId: string, currentUserId: string): Promise<{ currentUser: IUser; friendUser: IUser }> {
		if (userToFriendId === currentUserId) {
			throw new CustomError(UserErrorConstants.CannotFriendSelf, 400);
		}

		const currentUser: IUser = await this.userRepo.findById(currentUserId);
		const friendUser: IUser = await this.userRepo.findById(userToFriendId);

		const friendRequestSend = currentUser.friendNotifications.some((x: any) => x.friendId === userToFriendId);

		if (!friendRequestSend) {
			throw new CustomError(UserErrorConstants.FriendRequestNotSent, 400);
		}

		if (this.areFriends(currentUser, friendUser)) {
			throw new CustomError(UserErrorConstants.AlreadyFriends, 400);
		}

		currentUser.friendNotifications = currentUser.friendNotifications.filter((x: any) => x.friendId !== userToFriendId);
		friendUser.friendNotifications = friendUser.friendNotifications.filter((x: any) => x.friendId !== currentUserId);

		await currentUser.save();
		return {
			currentUser,
			friendUser,
		};
	}

	async addFriends(userA: IUser, userB: IUser, chatId: string): Promise<boolean> {
		if (userA.id === userB.id) {
			throw new CustomError(UserErrorConstants.CannotFriendSelf, 400);
		}

		const userBFriend: Friend = {
			friendId: userB.id,
			name: userB.name,
			imageUrl: userB.realData.imageUrl,
			realData: userB.realData,
			notifications: 0,
			isAnon: true,
			chatId,
		};
		const userAFriend: Friend = {
			friendId: userA.id,
			name: userA.name,
			imageUrl: userA.realData.imageUrl,
			realData: userA.realData,
			notifications: 0,
			isAnon: true,
			chatId,
		};

		userA.friends.push(userBFriend);
		userB.friends.push(userAFriend);

		await userA.save();
		await userB.save();
		return true;
	}

	async allFriendRequests(id: string): Promise<FriendNotification[]> {
		const user: IUser = await this.userRepo.findById(id);

		return user.friendNotifications;
	}

	// Chat Notifications
	async sendChatNotification(currentUserId: string, chatId: string): Promise<any> {
		const user: IUser = await this.userRepo.findById(currentUserId);

		const currentFriend: Friend = this.userRepo.findFriend(user.friends, chatId);

		currentFriend.notifications += 1;
		await user.save();

		io.emit('chat notifications', currentFriend.notifications);
		return {
			notifications: currentFriend.notifications,
			userId: currentUserId,
		};
	}

	async removeChatNotificationsForChat(chatId: string, userId: string): Promise<boolean> {
		const user: IUser = await this.userRepo.findById(userId);
		if (!chatId) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const foundFriend = this.userRepo.findFriend(user.friends, chatId);
		foundFriend.notifications = 0;

		await user.save();

		return true;
	}

	async allChatNotifications(id: string): Promise<number> {
		const user: IUser = await this.userRepo.findById(id);

		const notifications =
			user.friends.length === 0 ? 0 : user.friends.map((x: any) => x.notifications).reduce((a: number, b: number) => a + b);

		return notifications;
	}

	async changeChatAnonForUserInChat(chatId: string, id: string): Promise<boolean> {
		const user: IUser = await this.userRepo.findById(id);

		user.friends.forEach((x: any) => {
			x.isAnon = false;
		});

		await user.save();
		return true;
	}

	// Other
	async all(userEmail: string): Promise<UserBaseModel[]> {
		const users = await this.userRepo.find({
			email: { $not: { $eq: userEmail } },
		});

		const result: UserBaseModel[] = users.map((x: IUser) => {
			const model: UserBaseModel = {
				id: x.id,
				name: x.name,
				gender: x.gender,
				imageUrl: x.realData.imageUrl, //`${HelperConstants.imagesPath}${x.realData.imageName}`,
			};

			return model;
		});

		return result;
	}

	async allWithTags(tags: string, email: string, userId: string): Promise<UserBaseModel[]> {
		const users = await this.userRepo.find({
			$and: [
				{ tags: { $regex: tags } },
				{ email: { $not: { $eq: email } } },
				{
					'friends.friendId': { $not: { $regex: userId } },
				},
			],
		});

		if (!users) {
			throw new CustomError(UserErrorConstants.NotFound, 400);
		}

		const result: UserBaseModel[] = await Promise.all(
			users.map(async (x: IUser) => {
				const model: UserBaseModel = {
					id: x.id,
					name: x.name,
					tags: x.tags,
					gender: x.gender,
					friendRequestSent:
						x.friendNotifications.some((x: any) => x.friendId === userId) || x.friends.some((x: Friend) => x.friendId === userId),
					imageUrl: await CloudinaryHelper.getAvatar(),
				};
				return model;
			})
		);

		return result;
	}

	async allFriends(userId: string): Promise<FriendViewModel[]> {
		const users = await this.userRepo.findById(userId);

		const result: FriendViewModel[] = await Promise.all(
			users.friends.map(async (x: any) => {
				const model: FriendViewModel = {
					id: x.friendId,
					name: x.isAnon ? x.name : `${x.realData.firstName} ${x.realData.lastName}`,
					gender: x.gender,
					imageUrl: x.isAnon ? await CloudinaryHelper.getAvatar() : x.realData.imageUrl,
					notificationCount: x.notifications,
					chatId: x.chatId,
				};
				return model;
			})
		);

		return result;
	}

	// private methods
	private areFriends(currentUser: IUser, userToFriend: IUser): boolean {
		console.log('test');
		const usersAreFriends =
			userToFriend.friends.some((x: Friend) => x.friendId === currentUser.id) &&
			currentUser.friends.some((x: Friend) => x.friendId === userToFriend.id);
		return usersAreFriends;
	}
}
