import { UserRealData } from './UserRealData';

export interface JWTUserModel {
	id: string;
	name: string;
	email: string;
	realData: UserRealData;
	iat?: string;
	exp?: string;
}
