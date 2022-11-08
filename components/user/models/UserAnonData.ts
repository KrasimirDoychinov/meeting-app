import { Gender } from '../enums/genderEnums';

export interface UserAnonData {
	id: string;
	name: string;
	gender: Gender;
	messages: string[];
	tags?: string[];
}
