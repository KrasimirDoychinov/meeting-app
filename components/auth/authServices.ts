import {
	AuthReturnModel,
	JwtVerifyReturnModel,
} from './models/output/outputModels';

import {
	AuthLoginModel,
	AuthRegisterModel,
	JwtSignModel,
} from './models/input/inputModels';

import { IUser, User } from '../user/models/User';

import { CustomError } from '../errors/customError';

import { GlobalErrorConstants } from '../errors/errorConstants';
import { AuthErrorConstants } from './errors/constants';

import { EnvHelper } from '../helpers/envHelper';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class AuthServices {
	static async register({
		name,
		email,
		password,
		compare,
	}: AuthRegisterModel): Promise<AuthReturnModel> {
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

	static async login({
		email,
		password,
	}: AuthLoginModel): Promise<AuthReturnModel> {
		if (!email || !password) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const user: IUser | null = await User.findOne({ email });
		if (!user) {
			throw new CustomError(AuthErrorConstants.EmailNotFound, 400);
		}

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

	static verifyJWT(token: string): JwtVerifyReturnModel {
		const obj = jwt.verify(token, EnvHelper.JwtSecret) as jwt.JwtPayload;

		return {
			iat: obj.iat,
			exp: obj.exp,
		};
	}

	// private methods
	private static async hashPassword(originalPassword: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(originalPassword, salt);
		return hash;
	}

	private static signJWT(user: JwtSignModel): string {
		return jwt.sign(user, EnvHelper.JwtSecret, {
			expiresIn: EnvHelper.JwtLifetime,
		});
	}

	private static async comparePassword(
		password: string,
		hash: string
	): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}
}
