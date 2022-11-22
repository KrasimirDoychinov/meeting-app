import { BaseEntity } from '../../database/baseEntity';

export interface IPost extends BaseEntity {
	creatorId: string;
	description: string;
	createdOn: Date;
	likes: string[];
	tags: string[];
	imgUrl: string;
}
