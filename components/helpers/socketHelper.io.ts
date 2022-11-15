import { ChatServices } from '../chat/chatServices';
import { UserServices } from '../user/userServices';

export const ioHelper = async (io: any) => {
	io.on('connection', (socket: any) => {
		handleMessageEvent(socket, io);
		handleNotificationEvent(socket, io);
	});
};

const handleMessageEvent = async (socket: any, io: any) => {
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
};

const handleNotificationEvent = async (socket: any, io: any) => {
	socket.on('create notification', async (userId: string, chatId: string) => {
		const result = await UserServices.sendChatNotification(userId, chatId);

		io.emit('create notification', {
			count: result.notifications,
			userId: result.userId,
		});
	});
};
