import { CustomError } from '../errors/customError';
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

	static async changeAnonAgree(
		chatId: string,
		userId: string
	): Promise<ChatAnonData> {
		const chat = await Chat.findById(chatId);

		console.log(chatId, userId, chat);

		if (chat.personA.id === userId) {
			chat.personA.changeAnonAgree = true;
		} else if (chat.personB.id === userId) {
			chat.personB.changeAnonAgree = true;
		}

		await chat.save();

		const model: ChatAnonData = {
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

		return model;
	}

	static async changeAnon(id: string): Promise<ChatRealData> {
		const chat = await Chat.findById(id);

		if (
			!this.arePeopleAgreed(
				chat.personA.changeAnonAgree,
				chat.personB.changeAnonAgree
			)
		) {
			throw new CustomError(
				"Both parties haven't agreed to change the chat",
				400
			);
		}

		chat.isAnon = false;
		await chat.save();

		const model: ChatRealData = {
			personA: chat.personA,
			personB: chat.personB,
		};
		return model;
	}

	// Private methods
	private static arePeopleAgreed(
		personAAgree: boolean,
		personBAgree: boolean
	): boolean {
		return personAAgree && personBAgree;
	}
}
