import { PostStatus } from '../enums/PostStatusEnums';

export interface PostReturnModel {
	description: string;
	mediaUrl: string;
	likes: string[];
	status: PostStatus;
}
