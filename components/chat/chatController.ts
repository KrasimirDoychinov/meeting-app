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
