import { CustomError } from '../errors/customError';
import { User } from '../user/User';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

interface JWTUserModel {
	name: string;
	email: string;
}

export class AuthServices {
	// TODO: Register, login, verifyJWT, createJWT

	static async register(
		name: string,
		email: string,
		password: string,
		compare: string
	): Promise<string> {
		this.verifyCreds(name, email, password, compare);
		const user = await User.create({ name, email, password });

		const jwtUserModel: JWTUserModel = {
			name: user.name,
			email: user.email,
		};
		const token = this.signJWT(jwtUserModel);
		return token;
	}

	private static verifyCreds(
		name: string,
		email: string,
		password: string,
		compare: string
	) {
		if (!name || !email || !password || !compare) {
			throw new CustomError('All fields are required!', 400);
		}

		if (password !== compare) {
			throw new CustomError('Both passwords must match!', 400);
		}
	}

	private static signJWT(user: JWTUserModel) {
		return jwt.sign(user, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_LIFETIME,
		});
	}

	private static async comparePassword(
		canditatePassword: string,
		password: string
	) {
		return await bcrypt.compare(canditatePassword, password);
	}
}
