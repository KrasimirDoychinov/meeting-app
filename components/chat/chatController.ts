import { ChatServices } from './chatServices';

export const createChat = async (req: any, res: any) => {
	const personAId = res.user.id;
	const personBId = req.params.personId;

	const chat = await ChatServices.create(personAId, personBId);
	res.status(201).json(chat);
};

export const chatById = async (req: any, res: any) => {
	const id = req.params.id;

	const chat = await ChatServices.byId(id);
	res.status(200).json(chat);
};

export const changeAnonAgree = async (req: any, res: any) => {
	const chatId = req.params.id;
	const userId = res.user.id;

	const chat = await ChatServices.changeAnonAgree(chatId, userId);

	res.status(200).json(chat);
};

export const changeAnon = async (req: any, res: any) => {
	const id = req.params.id;

	const chat = await ChatServices.changeAnon(id);
	res.status(200).json(chat);
};
