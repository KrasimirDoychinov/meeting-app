import { UserRealData } from '../../user/models/output/UserRealData';

export interface AuthInputModel {
	id: string;
	name: string;
	email: string;
	tags: string[];
	iat?: string;
	exp?: string;
	realData: UserRealData;
}
