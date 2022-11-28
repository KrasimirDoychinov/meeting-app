import { BaseEntity } from '../../database/baseEntity';

export interface IPost extends BaseEntity {
	creator: {
		id: string;
		name: string;
		imageUrl: string;
	};
	description: string;
	createdOn: Date;
	likes: string[];
	tags: string[];
	imageUrl: string;
	comments: {
		creator: {
			id: string;
			name: string;
			imageUrl: string;
		};
		content: string;
	}[];
}
