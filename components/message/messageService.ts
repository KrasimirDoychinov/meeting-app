import { Message } from './models/Message';

export class MessageServices {
	static async create(
		chatId: string,
		content: string
	): Promise<typeof Message> {
		const message = await Message.create({ chatId, content });
		return message;
	}
}
