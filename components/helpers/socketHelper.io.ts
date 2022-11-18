import { autoInjectable } from 'tsyringe';
import { ChatServices } from '../chat/chatServices';
import { UserServices } from '../user/userServices';

@autoInjectable()
export class IoHelper {
	private userService: UserServices;

	constructor(io: any, userService?: UserServices) {
		this.userService = userService!;
		io.on('connection', (socket: any) => {
			this.handleMessageEvent(socket, io);
			this.handleNotificationEvent(socket, io);
		});
	}

	private async handleMessageEvent(socket, io) {
		socket.on(
			'create message',
			async (
				chatId: string,
				content: string,
				userId: string,
				friendId: string
			) => {
				if (content.length > 0) {
					const message = await ChatServices.createMessage({
						chatId,
						content,
						senderId: userId,
						receiverId: friendId,
					});
					io.emit('create message', { message, chatId });
				}
			}
		);
	}

	private async handleNotificationEvent(socket, io) {
		socket.on('create notification', async (userId: string, chatId: string) => {
			const result = await this.userService.sendChatNotification(
				userId,
				chatId
			);

			io.emit('create notification', {
				count: result.notifications,
				userId: result.userId,
			});
		});
	}
}
