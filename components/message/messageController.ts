import { MessageServices } from './messageService';

export const createMessage = async (req: any, res: any) => {
	const chatId = req.params.chatId;
	const { content } = req.body;
	const message = await MessageServices.create(chatId, content);

	res.status(201).json(message);
};
