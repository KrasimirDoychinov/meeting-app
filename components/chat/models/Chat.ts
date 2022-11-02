import { Message } from '../../message/models/Message';

const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
	{
		personA: {
			id: {
				type: String,
				required: true,
			},
			avatarUrl: {
				type: String,
				required: true,
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
		},
		personB: {
			id: {
				type: String,
				required: true,
			},
			avatarUrl: {
				type: String,
				required: true,
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
		},
		isAnon: {
			type: Boolean,
			default: true,
		},
		messages: [typeof Message],
	},
	{ collection: 'chat' }
);

export const Chat = mongoose.model('Chat', ChatSchema);
