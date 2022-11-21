import { StatusCodes } from 'http-status-codes';
import { autoInjectable } from 'tsyringe';
import { Repository } from '../global/repository';
import { IUser } from '../user/models/baseModels';

import { AuthServices } from './authServices';

@autoInjectable()
export default class AuthController {
	private authService: AuthServices;

	constructor(authService?: AuthServices) {
		this.authService = authService!;
	}

	register = async (req, res) => {
		const result = await this.authService.register(req.body);

		res.status(StatusCodes.OK).json(result);
	};

	login = async (req, res) => {
		const result = await this.authService.login(req.body);

		res.status(StatusCodes.OK).json(result);
	};
}
