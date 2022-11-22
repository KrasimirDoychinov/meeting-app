import { RealData } from '../../user/models/baseModels';
import * as mongoose from 'mongoose';

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

export interface IChat extends mongoose.Document {
	personA: ChatPerson;
	personB: ChatPerson;
	messages: [ChatMessage];
	isAnon: boolean;
}
