import { ChatServices } from '../chat/chatServices';
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

	const result = await UserServices.allFriends(userId);

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
	const createChat = await ChatServices.create(currentUserId, userToFriendId);

	res.status(200).json({ friends: result, chat: createChat });
};

export const friendNRequestsByUser = async (req: any, res: any) => {
	const id = res.user.id;

	const notifications = await UserServices.allFriendRequests(id);

	res.status(200).json({ notifications, count: notifications.length });
};
