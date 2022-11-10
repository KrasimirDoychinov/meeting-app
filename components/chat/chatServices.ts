import { CustomError } from '../errors/customError';
import { UserServices } from '../user/userServices';
import { Chat } from './models/Chat';
import { ChatModel } from './models/output/ChatAnonModel';
import { ChatMessage } from './models/input/ChatMessageModel';
import { ChatRealModel } from './models/output/ChatRealModel';

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
	): Promise<ChatMessage> {
		const chat = await Chat.findById(chatId);
		if (!this.isPersonInChat(chat, userId)) {
			throw new CustomError("This user doesn't belong to this chat", 400);
		}

		const message: ChatMessage = {
			senderId: userId,
			content: content,
		};
		chat?.messages.push(message);
		await chat.save();
		return message;
	}

	static async byId(personAId: string, personBId: string): Promise<ChatModel> {
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

		let model: ChatModel;
		if (chat.isAnon) {
			model = {
				id: chat.id,
				isAnon: true,
				messages: chat.messages,
				personA: {
					id: chat.personA.id,
					name: chat.personA.name,
					gender: chat.personA.gender,
				},
				personB: {
					id: chat.personB.id,
					name: chat.personB.name,
					gender: chat.personB.gender,
				},
			};
		} else {
			console.log(chat.personA);
			model = {
				id: chat.id,
				isAnon: false,
				messages: chat.messages,
				personA: {
					id: chat.personA.id,
					name:
						chat.personA.realData.firstName +
						' ' +
						chat.personA.realData.lastName,
					gender: chat.personA.gender,
				},
				personB: {
					id: chat.personA.id,
					name:
						chat.personB.realData.firstName +
						' ' +
						chat.personB.realData.lastName,
					gender: chat.personA.gender,
				},
			};
			console.log(model);
		}

		return model;
	}

	static async changeAnonAgree(
		chatId: string,
		userId: string
	): Promise<ChatModel> {
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
		let model: ChatModel = {
			id: chat.id,
			isAnon: chat.isAnon,
			messages: chat.messages,
			personA: {
				id: chat.personA.id,
				name: chat.personA.name,
				gender: chat.personA.gender,
			},
			personB: {
				id: chat.personB.id,
				name: chat.personB.name,
				gender: chat.personB.gender,
			},
		};

		if (
			this.arePeopleAgreed(
				chat.personA.changeAnonAgree,
				chat.personB.changeAnonAgree
			)
		) {
			model = await this.changeAnon(chat);
		}

		return model;
	}

	static async changeAnon(chat: typeof Chat): Promise<ChatRealModel> {
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

		const model: ChatRealModel = {
			id: chat.id,
			isAnon: chat.isAnon,
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
