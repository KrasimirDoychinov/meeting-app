import { PostStatus } from './PostStatusEnums';

export interface PostReturnModel {
	description: string;
	mediaUrl: string;
	likes: string[];
	status: PostStatus;
}
