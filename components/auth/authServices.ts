import {
	AuthReturnModel,
	JwtVerifyReturnModel,
} from './models/output/outputModels';

import {
	AuthLoginModel,
	AuthRegisterModel,
	JwtSignModel,
} from './models/input/inputModels';

import { User } from '../user/models/User';

import { CustomError } from '../errors/customError';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { AuthErrorConstants } from './errors/constants';
import { GlobalErrorHelper } from '../errors/errorHelper';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export class AuthServices {
	static async register({
		name,
		email,
		password,
		compare,
	}: AuthRegisterModel): Promise<AuthReturnModel> {
		if (GlobalErrorHelper.areFieldsNotNull([name, email, password, compare])) {
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
		if (GlobalErrorHelper.areFieldsNotNull([email, password])) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		const user = await User.findOne({ email });
		if (GlobalErrorHelper.areFieldsNotNull([user])) {
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
		return jwt.verify(token, process.env.JWT_SECRET);
	}

	// private methods
	private static async hashPassword(originalPassword: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(originalPassword, salt);
		return hash;
	}

	private static signJWT(user: JwtSignModel): string {
		return jwt.sign(user, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_LIFETIME,
		});
	}

	private static async comparePassword(
		password: string,
		hash: string
	): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}
}
