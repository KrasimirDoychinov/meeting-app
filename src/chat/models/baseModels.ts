import { RealData } from '../../user/models/baseModels';
import { BaseEntity } from '../../database/baseEntity';

export interface ChatBaseModel {
	id: string;
	isAnon: boolean;
	messages: ChatMessage[];
}

interface ChatPerson {
	id: string;
	gender: string;
	name: string;
	realData: RealData;
	changeAnonAgree: boolean;
}

export interface ChatMessage {
	senderId: string;
	content: string;
	date?: Date;
}

export interface IChat extends BaseEntity {
	personA: ChatPerson;
	personB: ChatPerson;
	messages: [ChatMessage];
	isAnon: boolean;
}
