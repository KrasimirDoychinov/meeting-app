import { User } from './models/User';
import { UserServices } from './userServices';

export const all = async (req: any, res: any) => {
	const userEmail = res.user.email;
	const users = await UserServices.all(userEmail);

	res.status(200).json(users);
};

export const addToFriend = async (req: any, res: any) => {
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

	res.status(200).json({ result });
};

export const friendNotificationsByUser = async (req: any, res: any) => {
	const id = res.user.id;

	const notifications = await UserServices.allFriendNotifications(id);

	res.status(200).json({ notifications, count: notifications.length });
};
