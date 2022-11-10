import { Gender } from '../../user/enums/genderEnums';

const mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema(
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
