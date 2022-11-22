import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
	creatorId: string;
	description: string;
	createdOn: Date;
	likes: string[];
	tags: string[];
	imgUrl: string;
}

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
