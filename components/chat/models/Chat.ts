import { Gender } from '../../user/enums/genderEnums';

import * as mongoose from 'mongoose';

interface ChatPerson {
	id: string;
	gender: string;
	name: string;
	realData: {
		firstName: string;
		lastName: string;
		imageUrl: string;
	};
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

const ChatSchema = new mongoose.Schema<IChat>(
	{
		personA: {
			id: {
				type: String,
				required: true,
			},
			gender: {
				type: Number,
				enum: [Gender.Male, Gender.Female],
			},
			name: {
				type: String,
				required: true,
			},
			realData: {
				firstName: String,
				lastName: String,
				imageUrl: String,
			},
			changeAnonAgree: {
				type: Boolean,
				default: false,
			},
		},
		personB: {
			id: {
				type: String,
				required: true,
			},
			gender: {
				type: Number,
				enum: [Gender.Male, Gender.Female],
			},
			name: {
				type: String,
				required: true,
			},
			realData: {
				firstName: String,
				lastName: String,
				imageUrl: String,
			},
			changeAnonAgree: {
				type: Boolean,
				default: false,
			},
		},
		messages: [
			{
				senderId: {
					type: String,
					required: true,
				},
				content: {
					type: String,
					required: true,
				},
				date: {
					type: Date,
					default: Date.now(),
				},
			},
		],
		isAnon: {
			type: Boolean,
			default: true,
		},
	},
	{ collection: 'chat' }
);

export const Chat = mongoose.model('Chat', ChatSchema);
