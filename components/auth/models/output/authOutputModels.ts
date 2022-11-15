import { UserRealData } from '../../../user/models/output/UserRealData';
import { AuthBaseModel } from '../authBaseModels';

export interface AuthReturnModel extends AuthBaseModel {
	token: string;
	iat?: string;
	exp?: string;
}

export interface JwtVerifyReturnModel extends AuthBaseModel {
	name: string;
	email: string;
	realData: UserRealData;
	token: string;
	iat?: string;
	exp?: string;
}
