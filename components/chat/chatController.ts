import { StatusCodes } from 'http-status-codes';
import { ChatServices } from './chatServices';

export const createChat = async (req: any, res: any) => {
	const personAId = res.user.id;
	const personBId = req.params.personId;

	const chat = await ChatServices.create(personAId, personBId);
	res.status(StatusCodes.CREATED).json(chat);
};

export const createMessage = async (req: any, res: any) => {
	const chatId = req.params.id;
	const userId = res.user.id;
	const { content, friendId } = req.body;

	const result = await ChatServices.createMessage({
		chatId,
		content,
		senderId: userId,
		receiverId: friendId,
	});
	res.status(StatusCodes.CREATED).json(result);
};

export const chatById = async (req: any, res: any) => {
	const chatId = req.params.chatId;
	const friendId = req.query.friendId;
	const userId = res.user.id;

	const chat = await ChatServices.byId({
		chatId,
		currentUserId: userId,
		friendUserId: friendId,
	});
	res.status(StatusCodes.OK).json(chat);
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
	res.status(StatusCodes.OK).json(chat);
};
