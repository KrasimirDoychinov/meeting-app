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

		const chat = await Chat.create({ personA, personB });
		return chat;
	}

	static async createMessage(
		chatId: string,
		userId: string,
		content: string
	): Promise<string> {
		const chat = await Chat.findById(chatId);
		if (!this.isPersonInChat(chat, userId)) {
			throw new CustomError("This user doesn't belong to this chat", 400);
		}

		chat.messages.push({
			senderId: userId,
			content: content,
		});
		await chat.save();
		return `Message: ${content} send succesfully from ${userId}`;
	}

	static async byId(
		personAId: string,
		personBId: string
	): Promise<ChatAnonData | ChatRealData> {
		const chat = (
			await Chat.find({
				$or: [
					{
						$and: [{ 'personA.id': personAId }, { 'personB.id': personBId }],
					},
					{
						$and: [{ 'personA.id': personBId }, { 'personB.id': personAId }],
					},
				],
			})
		)[0];

		let model: ChatAnonData | ChatRealData | undefined = undefined;
		if (chat.isAnon) {
			model = {
				id: chat.id,
				messages: chat.messages,
				personA: {
					id: chat.personA.id,
					name: chat.personA.name,
					gender: chat.personA.gender,
					messages: chat.personA.messages,
				},
				personB: {
					id: chat.personB.id,
					name: chat.personB.name,
					gender: chat.personB.gender,
					messages: chat.personB.messages,
				},
			};
		} else {
			model = {
				id: chat.id,
				messages: chat.messages,
				personA: chat.personA,
				personB: chat.personB,
			};
		}
		console.log(model);

		return model;
	}

	static async changeAnonAgree(
		chatId: string,
		userId: string
	): Promise<ChatAnonData> {
		const chat = await Chat.findById(chatId);

		if (!this.isPersonInChat(chat, userId)) {
			throw new CustomError("This user doesn't belong to this chat", 400);
		}

		if (chat.personA.id === userId) {
			chat.personA.changeAnonAgree = true;
		} else if (chat.personB.id === userId) {
			chat.personB.changeAnonAgree = true;
		}

		await chat.save();
		const model: ChatAnonData = {
			id: chat.id,
			messages: chat.messages,
			personA: {
				id: chat.personA.id,
				name: chat.personA.name,
				gender: chat.personA.gender,
				messages: chat.personA.messages,
			},
			personB: {
				id: chat.personB.id,
				name: chat.personB.name,
				gender: chat.personB.gender,
				messages: chat.personB.messages,
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
			id: chat.id,
			messages: chat.messages,
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

	private static isPersonInChat(chat: typeof Chat, personId: string): boolean {
		return chat.personA.id === personId || chat.personB.id === personId;
	}
}
