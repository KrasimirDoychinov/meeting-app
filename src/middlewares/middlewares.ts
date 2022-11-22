import { autoInjectable } from 'tsyringe';
import { AuthServices } from '../auth/authServices';
import { CustomError } from '../errors/customError';

interface Error {
	statusCode: string;
	msg: string;
}

@autoInjectable()
class AuthMiddleware {
	private authService: AuthServices;
	constructor(authService?: AuthServices) {
		this.authService = authService!;
	}

	authorize = (req: any, res: any, next: any) => {
		const header = req.headers.authorization;
		if (!header) {
			throw new CustomError('Authorization header is missing', 401);
		}

		const token = header.split(' ')[1];
		if (!token) {
			throw new CustomError('Bearer token is missing', 401);
		}

		res.user = this.authService.verifyJWT(token);
		next();
	};

	errorHandler = (err: any, req: any, res: any, next: any) => {
		const error: Error = {
			statusCode: err.statusCode || 500,
			msg: err.message || 'Something went wrong please try again',
		};

		return res.status(error.statusCode).json(error);
	};
}

const middlewares = new AuthMiddleware();

export const authorize = middlewares.authorize;
export const errorHandler = middlewares.errorHandler;
