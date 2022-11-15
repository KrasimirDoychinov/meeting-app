import { ChatReturnMessageModel } from './models/output/outputModels';
import { ChatReturnModel } from './models/output/outputModels';
import { ChatInput, ChatMessageModel } from './models/input/inputModels';

import { CustomError } from '../errors/customError';
import { UserServices } from '../user/userServices';
import { Chat } from './models/Chat';
import { io } from '../../app';
import { GlobalErrorHelper } from '../errors/errorHelper';
import { GlobalErrorConstants } from '../errors/errorConstants';

export class ChatServices {
	// Create
	static async create(
		personAId: string,
		personBId: string
	): Promise<typeof Chat> {
		const personA = await UserServices.byId(personAId);
		const personB = await UserServices.byId(personBId);

		const chat = await Chat.create({ personA, personB });
		return chat;
	}

	static async createMessage({
		chatId,
		senderId,
		receiverId,
		content,
	}: ChatMessageModel): Promise<ChatReturnMessageModel> {
		const chat = await Chat.findById(chatId);
		if (!this.isPersonInChat(chat, senderId)) {
			throw new CustomError("This user doesn't belong to this chat", 400);
		}

		const message: ChatReturnMessageModel = {
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
	static async byId({
		chatId,
		currentUserId,
		friendUserId,
	}: ChatInput): Promise<ChatReturnModel> {
		if (GlobalErrorHelper.areFieldsExactlyEqual(currentUserId, friendUserId)) {
			throw new CustomError(GlobalErrorConstants.FieldsAreEqual, 400);
		}

		const chat = await Chat.findById(chatId);
		if (GlobalErrorHelper.areFieldsNotNull([chat])) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const currentUser =
			chat.personA.id === currentUserId ? chat.personA : chat.personB;
		const friendUser =
			chat.personA.id === friendUserId ? chat.personA : chat.personB;

		return this.buildChatModel(chat, currentUser, friendUser);
	}

	// Anon status
	static async changeAnonAgree(
		chatId: string,
		userId: string
	): Promise<boolean> {
		const chat = await Chat.findById(chatId);
		if (GlobalErrorHelper.areFieldsNotNull([chat])) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		if (!this.isPersonInChat(chat, userId)) {
			throw new CustomError("This user doesn't belong to this chat", 400);
		}

		this.changeCorrectPersonAnonStatus(chat, userId);

		if (
			this.arePeopleAgreed(
				chat.personA.changeAnonAgree,
				chat.personB.changeAnonAgree
			)
		) {
			await this.changeAnon(chat);
		}

		await chat.save();
		return true;
	}

	static async changeAnon(chat: typeof Chat): Promise<boolean> {
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

		await UserServices.sendChatNotification(chat.personA.id, chat.id);
		await UserServices.sendChatNotification(chat.personB.id, chat.id);
		await UserServices.changeChatAnonForUserInChat(chat.id, chat.personA.id);
		await UserServices.changeChatAnonForUserInChat(chat.id, chat.personB.id);
		return true;
	}

	// Private methods
	private static buildChatModel(
		chat: typeof Chat,
		currentUser,
		friendUser
	): ChatReturnModel {
		let model: ChatReturnModel;
		model = {
			id: chat.id,
			isAnon: chat.isAnon,
			messages: chat.messages,
		};

		if (chat.isAnon) {
			model.currentUser = {
				id: currentUser.id,
				name: currentUser.name,
				gender: currentUser.gender,
				changeAnonAgree: currentUser.changeAnonAgree,
			};
			model.friendUser = {
				id: friendUser.id,
				name: friendUser.name,
				gender: friendUser.gender,
				changeAnonAgree: friendUser.changeAnonAgree,
			};
		} else {
			model.currentUser = {
				id: currentUser.id,
				name: `${currentUser.realData.firstName} ${currentUser.realData.lastName}`,
				gender: currentUser.gender,
				changeAnonAgree: currentUser.changeAnonAgree,
			};
			model.friendUser = {
				id: friendUser.id,
				name: `${friendUser.realData.firstName} ${friendUser.realData.lastName}`,
				gender: friendUser.gender,
				changeAnonAgree: friendUser.changeAnonAgree,
			};
		}

		return model;
	}

	private static arePeopleAgreed(
		personAAgree: boolean,
		personBAgree: boolean
	): boolean {
		return personAAgree && personBAgree;
	}

	private static isPersonInChat(chat: typeof Chat, personId: string): boolean {
		return chat.personA.id === personId || chat.personB.id === personId;
	}

	private static changeCorrectPersonAnonStatus(
		chat: typeof Chat,
		userId: string
	): void {
		if (chat.personA.id === userId) {
			chat.personA.changeAnonAgree = true;
		} else if (chat.personB.id === userId) {
			chat.personB.changeAnonAgree = true;
		}
	}
}
