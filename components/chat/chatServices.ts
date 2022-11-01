import { Chat } from './models/Chat';

export class ChatServices {
	static async create(personA: string, personB: string): Promise<typeof Chat> {
		const chat = await Chat.create({ personA, personB });

		return chat;
	}
}
