import { UserServices } from './userServices';

export const all = async (req: any, res: any) => {
	const userEmail = res.user.email;
	const users = await UserServices.all(userEmail);

	res.status(200).json(users);
};

export const addToFriend = async (req: any, res: any) => {
	const userToFriendId = req.params.id;
	const currentUserId = res.user.id;

	const result = await UserServices.addFriend(userToFriendId, currentUserId);

	res.status(200).json({ result });
};
