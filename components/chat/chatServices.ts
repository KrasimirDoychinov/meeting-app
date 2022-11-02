import { UserServices } from '../user/userServices';
import { Chat } from './models/Chat';
import { ChatAnonData } from './models/ChatAnonData';
import { ChatRealData } from './models/ChatRealData';

export class ChatServices {
	static async create(
		personAId: string,
		personBId: string
	): Promise<typeof Chat> {
		const personA = await UserServices.byId(personAId);
		const personB = await UserServices.byId(personBId);

		console.log(personA);
		console.log(personB);
		const chat = await Chat.create({ personA, personB });
		return chat;
	}

	static async byId(id: string): Promise<ChatAnonData | ChatRealData> {
		const chat = await Chat.findById(id);

		let model: ChatAnonData | ChatRealData | undefined = undefined;
		console.log(chat);
		if (chat.isAnon) {
			model = {
				personA: {
					id: chat.personA.id,
					name: chat.personA.name,
					avatarUrl: chat.personA.avatarUrl,
				},
				personB: {
					id: chat.personA.id,
					name: chat.personA.name,
					avatarUrl: chat.personA.avatarUrl,
				},
			};
		} else {
			model = {
				personA: chat.personA,
				personB: chat.personB,
			};
		}

		return model;
	}
}
