import { autoInjectable } from 'tsyringe';
import { UserServices } from './userServices';

@autoInjectable()
export default class UserController {
	userService: UserServices;
	constructor(userService?: UserServices) {
		this.userService = userService!;
	}

	allWithTags = async (req: any, res: any) => {
		const tags = req.query.tags;
		const userId = res.user.id;
		const email = res.user.email;

		const result = await this.userService.allWithTags(tags, email, userId);

		res.status(200).json(result);
	};

	allFriends = async (req: any, res: any) => {
		const userId = res.user.id;

		const result = await this.userService.allFriends(userId);

		res.status(200).json(result);
	};

	sendFriendRequest = async (req: any, res: any) => {
		const userToFriendId = req.params.id;
		const currentUserId = res.user.id;

		const result = await this.userService.sendFriendRequest(
			userToFriendId,
			currentUserId
		);

		res.status(200).json({ result });
	};

	acceptFriendRequest = async (req: any, res: any) => {
		const userToFriendId = req.params.id;
		const currentUserId = res.user.id;

		const result = await this.userService.acceptFriendRequest(
			userToFriendId,
			currentUserId
		);

		res.status(200).json({ friends: result });
	};

	friendNRequestsByUser = async (req: any, res: any) => {
		const id = res.user.id;

		const notifications = await this.userService.allFriendRequests(id);

		res.status(200).json({ notifications, count: notifications.length });
	};

	chatNotificationsByUser = async (req: any, res: any) => {
		const id = res.user.id;

		const notifications = await this.userService.allChatNotifications(id);
		res.status(200).json(notifications);
	};

	removeChatNotificationsByChatId = async (req: any, res: any) => {
		const chatId = req.params.chatId;
		const userId = res.user.id;

		const result = await this.userService.removeChatNotificationsForChat(
			chatId,
			userId
		);
		res.status(200).json({ success: result });
	};

	initialRealData = async (req: any, res: any) => {
		const id = res.user.id;
		const { firstName, lastName, img } = req.body;
		const response = await this.userService.setRealData(
			id,
			firstName,
			lastName,
			img
		);

		res.status(200).json({ success: response });
	};
}
