import { Gender } from '../../enums/genderEnums';
import { RealData } from '../User';

export interface UserBaseModel {
	id: string;
	name: string;
	gender: Gender;
	tags?: string[];
	imageUrl?: string;
	friendRequestSent?: boolean;
	changeAnonAgree?: boolean;
}

export interface FriendModel extends UserBaseModel {
	notificationCount: number;
	chatId: string;
}

export interface UserFullModel extends UserBaseModel {
	realData: RealData;
}
