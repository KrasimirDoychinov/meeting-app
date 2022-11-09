export interface AuthReturnModel {
	token: string;
	iat: string | undefined;
	exp: string | undefined;
	id: string;
	tags?: string[];
}
