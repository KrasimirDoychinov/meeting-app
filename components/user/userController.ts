import { UserServices } from './userServices';

export const all = async (req: any, res: any) => {
	const users = await UserServices.all();

	res.status(200).json(users);
};
