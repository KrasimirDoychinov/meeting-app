import { Message } from './models/Message';

export class MessageServices {
	static async create(
		chatId: string,
		senderId: string,
		content: string
	): Promise<typeof Message> {
		const message = await Message.create({ chatId, senderId, content });
		return message;
	}

	static async allByChat(chatId: string): Promise<typeof Message[]> {
		const messages = await Message.find({ chatId });
		return messages;
	}
}
