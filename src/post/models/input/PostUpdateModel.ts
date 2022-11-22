import { PostStatus } from '../enums/PostStatusEnums';

export interface PostUpdateModel {
	creatorId: string;
	description: string;
	mediaUrl: string;
	status: PostStatus;
}
