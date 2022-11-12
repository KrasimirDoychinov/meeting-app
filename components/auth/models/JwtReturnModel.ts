import { UserRealData } from '../../user/models/output/UserRealData';

export interface JwtReturnModel {
	id: string;
	name: string;
	email: string;
	tags: string[];
	realData: UserRealData;
	iat?: string;
	exp?: string;
}
