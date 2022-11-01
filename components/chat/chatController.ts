import { ChatServices } from './chatServices';

export const createChat = async (req: any, res: any) => {
	const personA = res.user.id;
	const personB = req.params.personId;

	const chat = await ChatServices.create(personA, personB);
	res.status(201).json(chat);
};
