import { Gender } from '../../enums/genderEnums';

export interface UserBaseModel {
	id: string;
	name: string;
	gender: Gender;
	tags?: string[];
	imageName?: string;
	friendRequestSent?: boolean;
	changeAnonAgree?: boolean;
}

export interface FriendModel extends UserBaseModel {
	notificationCount: number;
}
