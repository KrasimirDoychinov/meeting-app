const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
	{
		senderId: {
			type: String,
			required: true,
		},
		chatId: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
			maxLength: 500,
		},
	},
	{ collection: 'message' }
);

export const Message = mongoose.model('Message', MessageSchema);
