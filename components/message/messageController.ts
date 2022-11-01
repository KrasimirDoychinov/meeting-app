import { MessageServices } from './messageService';

export const createMessage = async (req: any, res: any) => {
	const chatId = req.params.chatId;
	const senderId = res.user.id;
	const { content } = req.body;
	const message = await MessageServices.create(chatId, senderId, content);

	res.status(201).json(message);
};

export const allByChat = async (req: any, res: any) => {
	const chatId = req.params.chatId;

	const messages = await MessageServices.allByChat(chatId);
	res.status(200).json(messages);
};
