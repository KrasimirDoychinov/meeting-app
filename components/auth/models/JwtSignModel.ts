import { UserRealData } from '../../user/models/output/UserRealData';

export interface JwtSignModel {
	id: string;
	name: string;
	email: string;
	tags: string[];
	realData?: UserRealData;
}
