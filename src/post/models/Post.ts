import mongoose from 'mongoose';
import { IPost } from './baseModels';

export const PostSchema = new mongoose.Schema<IPost>(
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
		likes: [String],
		tags: [String],
		imgUrl: String,
	},
	{ collection: 'post' }
);

export const Post = mongoose.model('Post', PostSchema);
