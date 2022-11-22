import { StatusCodes } from 'http-status-codes';
import { autoInjectable } from 'tsyringe';
import { ChatServices } from './chatServices';

@autoInjectable()
export default class ChatController {
	private chatService: ChatServices;

	constructor(chatService?: ChatServices) {
		this.chatService = chatService!;
	}

	createChat = async (req: any, res: any) => {
		const personAId = res.user.id;
		const personBId = req.params.personId;

		const chat = await this.chatService.create(personAId, personBId);
		res.status(StatusCodes.CREATED).json(chat);
	};

	createMessage = async (req: any, res: any) => {
		const chatId = req.params.id;
		const userId = res.user.id;
		const { content, friendId } = req.body;

		const message = await this.chatService.createMessage({
			chatId,
			content,
			senderId: userId,
			receiverId: friendId,
		});
		res.status(StatusCodes.CREATED).json(message);
	};

	chatById = async (req: any, res: any) => {
		const chatId = req.params.chatId;
		const friendId = req.query.friendId;
		const userId = res.user.id;

		const chat = await this.chatService.byId({
			chatId,
			currentUserId: userId,
			friendUserId: friendId,
		});
		res.status(StatusCodes.OK).json(chat);
	};

	changeAnonAgree = async (req: any, res: any) => {
		const chatId = req.params.id;
		const userId = res.user.id;

		const chat = await this.chatService.changeAnonAgree(chatId, userId);
		res.status(200).json(chat);
	};

	changeAnon = async (req: any, res: any) => {
		const id = req.params.id;

		const chat = await this.chatService.changeAnon(id);
		res.status(StatusCodes.OK).json(chat);
	};
}
