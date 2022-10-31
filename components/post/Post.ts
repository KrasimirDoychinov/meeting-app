import { PostStatus } from './internalModels/PostStatusEnums';

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
	{
		creatorId: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
			minLength: 10,
			maxLength: 200,
		},
		createdOn: {
			type: Date,
			default: new Date(),
		},
		status: {
			type: Number,
			required: true,
			enum: [PostStatus.Public, PostStatus.Private, PostStatus.Friends],
		},
		likes: [String],
		mediaUrl: String,
	},
	{ collection: 'post' }
);

export const Post = mongoose.model('Post', PostSchema);
