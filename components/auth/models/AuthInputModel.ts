import { UserRealData } from '../../user/models/UserRealData';

export interface AuthInputModel {
	id: string;
	name: string;
	email: string;
	tags: string[];
	iat?: string;
	exp?: string;
	realData: UserRealData;
}
