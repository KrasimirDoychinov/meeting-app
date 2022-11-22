import { AuthBaseModel } from '../baseModels';

export interface AuthViewModel extends AuthBaseModel {
	token: string;
	iat?: number;
	exp?: number;
}

export interface JwtVerifyViewModel extends AuthBaseModel {
	email: string;
	iat?: number;
	exp?: number;
}
