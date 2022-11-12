import { CustomError } from '../errors/customError';
import { JwtReturnModel } from './models/JwtReturnModel';
import { User } from '../user/models/User';
import { UserRealData } from '../user/models/output/UserRealData';
import { AuthReturnModel } from './models/AuthReturnModel';
import { JwtSignModel } from './models/JwtSignModel';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { AuthErrorConstants } from './constants/errorConstants';
import { GlobalErrorHelper } from '../errors/errorHelper';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export class AuthServices {
	static async register(
		name: string,
		email: string,
		password: string,
		compare: string
	): Promise<AuthReturnModel> {
		if (GlobalErrorHelper.areFieldsNotNull([name, email, password, compare])) {
			throw new CustomError(GlobalErrorConstants.AllFieldsRequired, 400);
		}

		if (password !== compare) {
			throw new CustomError(AuthErrorConstants.PasswordMismatch, 400);
		}

		// TODO: Hard coded for now
		const realData: UserRealData = {
			firstName: 'Krasimir',
			lastName: 'Doychinov',
			imageUrl: 'Image url',
		};

		const hash = this.hashPassword(password);
		const user = await User.create({
			name,
			email,
			password: hash,
			realData,
		});

		const jwtUserModel: JwtSignModel = {
			id: user.id,
			name: user.name,
			email: user.email,
			tags: user.tags,
			realData,
		};
		const token = this.signJWT(jwtUserModel);
		const result = this.verifyJWT(token);

		return { token, iat: result.iat, exp: result.exp, id: user.id };
	}

	static async login(
		email: string,
		password: string
	): Promise<AuthReturnModel> {
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
			iat: result.iat,
			exp: result.exp,
			tags: user.tags,
			id: user.id,
		};
	}

	static verifyJWT(token: string): JwtReturnModel {
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
