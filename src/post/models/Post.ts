import mongoose from 'mongoose';
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
		likes: [String],
		tags: [String],
		imageUrl: String,
	},
	{ collection: 'post' }
);

export const Post = mongoose.model('Post', PostSchema);
