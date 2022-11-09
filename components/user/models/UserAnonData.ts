import { Gender } from '../enums/genderEnums';

export interface UserAnonData {
	id: string;
	name: string;
	gender: Gender;
	tags?: string[];
	friendRequestSent?: boolean;
}
