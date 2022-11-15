import { UserServices } from './userServices';

export const allWithTags = async (req: any, res: any) => {
	const tags = req.query.tags;
	const userId = res.user.id;
	const email = res.user.email;

	const result = await UserServices.allWithTags(tags, email, userId);

	res.status(200).json(result);
};

export const allFriends = async (req: any, res: any) => {
	const userId = res.user.id;

	const result = await UserServices.allFriends(userId, false);

	res.status(200).json(result);
};

export const sendFriendRequest = async (req: any, res: any) => {
	const userToFriendId = req.params.id;
	const currentUserId = res.user.id;

	const result = await UserServices.sendFriendRequest(
		userToFriendId,
		currentUserId
	);

	res.status(200).json({ result });
};

export const acceptFriendRequest = async (req: any, res: any) => {
	const userToFriendId = req.params.id;
	const currentUserId = res.user.id;

	const result = await UserServices.acceptFriendRequest(
		userToFriendId,
		currentUserId
	);

	res.status(200).json({ friends: result });
};

export const friendNRequestsByUser = async (req: any, res: any) => {
	const id = res.user.id;

	const notifications = await UserServices.allFriendRequests(id);

	res.status(200).json({ notifications, count: notifications.length });
};

export const chatNotificationsByUser = async (req: any, res: any) => {
	const id = res.user.id;

	const notifications = await UserServices.allChatNotifications(id);
	res.status(200).json(notifications);
};

export const removeChatNotificationsByChatId = async (req: any, res: any) => {
	const chatId = req.params.chatId;
	const userId = res.user.id;

	const result = await UserServices.removeChatNotificationsForChat(
		chatId,
		userId
	);
	res.status(200).json({ success: result });
};

export const initialRealData = async (req: any, res: any) => {
	const id = res.user.id;
	const { firstName, lastName } = JSON.parse(req.body.body);
	const file = req.files?.img;
	const response = await UserServices.setRealData(
		id,
		firstName,
		lastName,
		file
	);

	res.status(200).json({ success: response });
};
