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
			changeAnonAgree: {
				type: Boolean,
				default: false,
			},
			messages: {
				type: [String],
				required: false,
				maxLength: 300,
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
			changeAnonAgree: {
				type: Boolean,
				default: false,
			},
			messages: {
				type: [String],
				required: false,
				maxLength: 300,
				minLength: 1,
			},
		},
		isAnon: {
			type: Boolean,
			default: true,
		},
	},
	{ collection: 'chat' }
);

export const Chat = mongoose.model('Chat', ChatSchema);
