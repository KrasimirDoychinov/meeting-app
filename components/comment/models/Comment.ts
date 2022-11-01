const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
	{
		creatorId: {
			type: String,
			required: true,
		},
		postId: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
			minLength: 2,
			maxLength: 200,
		},
		likes: [String],
	},
	{ collection: 'comments' }
);

export const Comment = mongoose.model('Comment', CommentSchema);
