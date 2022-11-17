import { RealData } from '../../../user/models/baseModels';
import { AuthBaseModel } from '../baseModels';

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
	realData?: RealData;
}

export interface AuthLoginModel {
	email: string;
	password: string;
}
