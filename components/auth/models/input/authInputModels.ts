import { UserRealData } from '../../../user/models/output/UserRealData';
import { AuthBaseModel } from '../authBaseModels';

export interface AuthRegisterModel {
	name: string;
	email: string;
	password: string;
	compare: string;
}

export interface JwtSignModel extends AuthBaseModel {
	id: string;
	name: string;
	email: string;
	tags: string[];
	realData?: UserRealData;
}

export interface AuthLoginModel {
	email: string;
	password: string;
}
