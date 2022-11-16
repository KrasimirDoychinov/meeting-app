import { ChatMessage } from './Chat';

export interface ChatBaseModel {
	id: string;
	isAnon: boolean;
	messages: ChatMessage[];
}
