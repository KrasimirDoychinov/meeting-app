export interface JwtReturnModel {
	token: string;
	iat: string | undefined;
	exp: string | undefined;
	tags?: string[];
}
