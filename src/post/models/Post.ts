import mongoose, { trusted } from 'mongoose';
import { IPost } from './baseModels';

const CreatorSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
});

const CommentSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	creator: CreatorSchema,
});

export const PostSchema = new mongoose.Schema<IPost>(
	{
		creator: CreatorSchema,
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
		comments: [CommentSchema],
		likes: [String],
		tags: [String],
		imageUrl: String,
	},
	{ collection: 'post' }
);

export const Post = mongoose.model('Post', PostSchema);
