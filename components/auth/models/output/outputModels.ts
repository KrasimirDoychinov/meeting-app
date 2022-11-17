import { AuthBaseModel } from '../baseModels';

export interface AuthReturnModel extends AuthBaseModel {
	token: string;
	iat?: number;
	exp?: number;
}

export interface JwtVerifyReturnModel {
	iat?: number;
	exp?: number;
}
