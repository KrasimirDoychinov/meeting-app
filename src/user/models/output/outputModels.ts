import { Gender } from '../../enums/genderEnums';
import { RealData } from '../baseModels';

export interface UserBaseModel {
	id: string;
	name: string;
	gender: Gender;
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
