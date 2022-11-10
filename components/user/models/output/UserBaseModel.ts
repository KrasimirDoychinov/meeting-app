import { Gender } from '../../enums/genderEnums';

export interface UserBaseModel {
	id: string;
	name: string;
	gender: Gender;
	tags?: string[];
	friendRequestSent?: boolean;
	changeAnonAgree?: boolean;
}
