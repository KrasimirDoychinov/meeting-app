import { Gender } from '../../user/enums/genderEnums';

import * as mongoose from 'mongoose';
import { RealDataSchema } from '../../user/models/User';
import { IChat } from './baseModels';

const MessageSchema = new mongoose.Schema({
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
});

const PersonSchema = new mongoose.Schema({
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
	realData: RealDataSchema,
	changeAnonAgree: {
		type: Boolean,
		default: false,
	},
});

const ChatSchema = new mongoose.Schema<IChat>(
	{
		personA: PersonSchema,
		personB: PersonSchema,
		messages: [MessageSchema],
		isAnon: {
			type: Boolean,
			default: true,
		},
	},
	{ collection: 'chat' }
);

export const Chat = mongoose.model('Chat', ChatSchema);
