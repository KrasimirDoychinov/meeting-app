import { IPost } from '../../../post/models/baseModels';
import { RealData } from '../baseModels';

export interface UserBaseModel {
	id: string;
	name: string;
	tags?: string[];
	imageUrl?: string;
	friendRequestSent?: boolean;
	changeAnonAgree?: boolean;
}

export interface FriendViewModel extends UserBaseModel {
	notificationCount: number;
	chatId: string;
}

export interface UserFullViewModelModel extends UserBaseModel {
	realData: RealData;
}

export interface UserForeignUserModel extends UserBaseModel {
	posts: IPost[];
}
