import { Message } from '../../message/models/Message';

const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
	{
		personA: {
			type: String,
			required: true,
		},
		personB: {
			type: String,
			required: true,
		},
		messages: [typeof Message],
	},
	{ collection: 'chat' }
);

export const Chat = mongoose.model('Chat', ChatSchema);
