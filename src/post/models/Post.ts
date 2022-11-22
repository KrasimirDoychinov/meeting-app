import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
	creatorId: string;
	description: string;
	createdOn: Date;
	likes: string[];
	tags: string[];
	imgUrl: string;
}

const PostSchema = new mongoose.Schema<IPost>(
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
		// status: {
		// 	type: Number,
		// 	required: true,
		// 	enum: [PostStatus.Public, PostStatus.Private, PostStatus.Friends],
		// },
		likes: [String],
		tags: [String],
		imgUrl: String,
	},
	{ collection: 'post' }
);

export const Post = mongoose.model('Post', PostSchema);
