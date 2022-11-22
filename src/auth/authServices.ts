import { AuthViewModel, JwtVerifyViewModel } from './models/output/outputModels';

import { AuthLoginModel, AuthRegisterModel, JwtSignModel } from './models/input/inputModels';

import { User } from '../user/models/User';

import { CustomError } from '../errors/customError';

import { GlobalErrorConstants } from '../errors/errorConstants';
import { AuthErrorConstants } from './errors/constants';

import { EnvHelper } from '../helpers/envHelper';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUser } from '../user/models/baseModels';
import { autoInjectable, injectable } from 'tsyringe';
import { UserRepository } from '../user/userRepository';

@injectable()
@autoInjectable()
export class AuthServices {
	private userRepo: UserRepository;

	constructor(userRepo?: UserRepository) {
		this.userRepo = userRepo!;
	}

	async register({ name, email, password, compare }: AuthRegisterModel): Promise<AuthViewModel> {
		if (!name || !email || !password || !compare) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		if (password !== compare) {
			throw new CustomError(AuthErrorConstants.PasswordMismatch, 400);
		}

		const hash = await this.hashPassword(password);
		const user = await User.create({
			name,
			email,
			password: hash,
		});

		const jwtUserModel: JwtSignModel = {
			id: user.id,
			name: user.name,
			email: user.email,
			tags: user.tags,
		};
		const token = this.signJWT(jwtUserModel);
		const result = this.verifyJWT(token);

		return { token, id: user.id, iat: result.iat, exp: result.exp };
	}

	async login({ email, password }: AuthLoginModel): Promise<AuthViewModel> {
		if (!email || !password) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const user: IUser = await this.userRepo.findOne({ email });
		const passwordsMatch = await this.comparePassword(password, user.password);
		if (!passwordsMatch) {
			throw new CustomError(AuthErrorConstants.PasswordMismatch, 400);
		}

		const jwtUserModel: JwtSignModel = {
			id: user.id,
			name: user.name,
			email: user.email,
			tags: user.tags,
			realData: user.realData,
		};

		const token = this.signJWT(jwtUserModel);
		const result = this.verifyJWT(token);

		return {
			token,
			id: user.id,
			iat: result.iat,
			exp: result.exp,
			tags: user.tags,
		};
	}

	verifyJWT(token: string): JwtVerifyViewModel {
		const obj = jwt.verify(token, EnvHelper.JwtSecret) as jwt.JwtPayload;

		return {
			id: obj.id,
			email: obj.email,
			tags: obj.tags,
			iat: obj.iat,
			exp: obj.exp,
		};
	}

	// private methods
	private async hashPassword(originalPassword: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(originalPassword, salt);
		return hash;
	}

	private signJWT(user: JwtSignModel): string {
		return jwt.sign(user, EnvHelper.JwtSecret, {
			expiresIn: EnvHelper.JwtLifetime,
		});
	}

	private async comparePassword(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}
}
