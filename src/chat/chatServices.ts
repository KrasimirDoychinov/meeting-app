import { ChatInput, ChatMessageModel } from './models/input/inputModels';

import { CustomError } from '../errors/customError';
import { UserServices } from '../user/userServices';
import { io } from '../../app';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { ChatMessage, IChat } from './models/baseModels';
import { ChatViewModel } from './models/output/outputModels';
import { autoInjectable, injectable } from 'tsyringe';
import ChatRepository from './chatRepository';

@injectable()
@autoInjectable()
export class ChatServices {
	private userService: UserServices;
	private chatRepo: ChatRepository;

	constructor(userService?: UserServices, chatRepo?: ChatRepository) {
		this.userService = userService!;
		this.chatRepo = chatRepo!;
	}

	// Create
	async create(personAId: string, personBId: string) {
		const personA = await this.userService.byId(personAId);
		const personB = await this.userService.byId(personBId);

		const chat = await this.chatRepo.create({ personA, personB });
		return chat;
	}

	async createMessage({
		chatId,
		senderId,
		receiverId,
		content,
	}: ChatMessageModel): Promise<ChatMessage> {
		const chat = await this.chatRepo.findById(chatId);

		if (!this.isPersonInChat(chat, senderId)) {
			throw new CustomError("This user  doesn't belong to this chat", 400);
		}

		const message: ChatMessage = {
			senderId,
			content: content,
		};
		chat.messages.push(message);

		// emit event to the frontend to increase the notifications for the user
		io.emit('chat notification', receiverId, chatId);

		await chat.save();
		return message;
	}

	// Retrieve
	async byId({ chatId, currentUserId, friendUserId }: ChatInput): Promise<ChatViewModel> {
		if (currentUserId === friendUserId) {
			throw new CustomError(GlobalErrorConstants.FieldsAreEqual, 400);
		}

		const chat = await this.chatRepo.findById(chatId);
		if (!chat) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const currentUser = chat.personA.id === currentUserId ? chat.personA : chat.personB;
		const friendUser = chat.personA.id === friendUserId ? chat.personA : chat.personB;

		return this.buildChatModel(chat, currentUser, friendUser);
	}

	// Anon status
	async changeAnonAgree(chatId: string, userId: string): Promise<boolean> {
		const chat = await this.chatRepo.findById(chatId);

		if (!this.isPersonInChat(chat, userId)) {
			throw new CustomError("This user doesn't belong to this chat", 400);
		}

		this.changeCorrectPersonAnonStatus(chat, userId);

		if (
			this.arePeopleAgreed(chat.personA.changeAnonAgree, chat.personB.changeAnonAgree)
		) {
			await this.changeAnon(chat);
		}

		await chat.save();
		return true;
	}

	async changeAnon(chat: IChat): Promise<boolean> {
		if (
			!this.arePeopleAgreed(chat.personA.changeAnonAgree, chat.personB.changeAnonAgree)
		) {
			throw new CustomError("Both parties haven't agreed to change the chat", 400);
		}

		chat.isAnon = false;
		await chat.save();

		await this.userService.sendChatNotification(chat.personA.id, chat.id);
		await this.userService.sendChatNotification(chat.personB.id, chat.id);
		await this.userService.changeChatAnonForUserInChat(chat.id, chat.personA.id);
		await this.userService.changeChatAnonForUserInChat(chat.id, chat.personB.id);
		return true;
	}

	// Private methods
	private buildChatModel(chat: IChat, currentUser, friendUser): ChatViewModel {
		let model: ChatViewModel;
		model = {
			id: chat.id,
			isAnon: chat.isAnon,
			messages: chat.messages,
		};

		if (chat.isAnon) {
			model.currentUser = {
				id: currentUser.id,
				name: currentUser.name,
				changeAnonAgree: currentUser.changeAnonAgree,
			};
			model.friendUser = {
				id: friendUser.id,
				name: friendUser.name,
				changeAnonAgree: friendUser.changeAnonAgree,
			};
		} else {
			model.currentUser = {
				id: currentUser.id,
				name: `${currentUser.realData.firstName} ${currentUser.realData.lastName}`,
				changeAnonAgree: currentUser.changeAnonAgree,
			};
			model.friendUser = {
				id: friendUser.id,
				name: `${friendUser.realData.firstName} ${friendUser.realData.lastName}`,
				changeAnonAgree: friendUser.changeAnonAgree,
			};
		}

		return model;
	}

	private arePeopleAgreed(personAAgree: boolean, personBAgree: boolean): boolean {
		return personAAgree && personBAgree;
	}

	private isPersonInChat(chat: IChat, personId: string): boolean {
		return chat.personA.id === personId || chat.personB.id === personId;
	}

	private changeCorrectPersonAnonStatus(chat: IChat, userId: string): void {
		if (chat.personA.id === userId) {
			chat.personA.changeAnonAgree = true;
		} else if (chat.personB.id === userId) {
			chat.personB.changeAnonAgree = true;
		}
	}
}
