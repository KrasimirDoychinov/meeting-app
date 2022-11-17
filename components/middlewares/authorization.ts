import { AuthServices } from '../auth/authServices';
import { CustomError } from '../errors/customError';

export const authorize = (req: any, res: any, next: any) => {
	const header = req.headers.authorization;
	if (!header) {
		throw new CustomError('Authorization header is missing', 401);
	}

	const token = header.split(' ')[1];
	if (!token) {
		throw new CustomError('Bearer token is missing', 401);
	}

	res.user = AuthServices.verifyJWT(token);
	next();
};
