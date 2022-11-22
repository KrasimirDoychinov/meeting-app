export interface ChatMessageModel {
	chatId: string;
	senderId: string;
	receiverId: string;
	content: string;
}

export interface ChatInput {
	chatId: string;
	currentUserId: string;
	friendUserId: string;
}
