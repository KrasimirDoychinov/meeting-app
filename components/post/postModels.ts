import { PostStatus } from './PostStatusEnums';

export interface PostReturnModel {
	creatorId: string;
	description: string;
	mediaUrl: string;
	status: PostStatus;
}
