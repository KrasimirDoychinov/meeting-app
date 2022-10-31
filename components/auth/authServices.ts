import { CustomError } from '../errors/customError';
import { JWTUserModel } from '../user/jwtUserModel';
import { User } from '../user/User';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export class AuthServices {
	static async register(
		name: string,
		email: string,
		password: string,
		compare: string
	): Promise<string> {
		if (!name || !email || !password || !compare) {
			throw new CustomError('All fields are required!', 400);
		}

		if (password !== compare) {
			throw new CustomError('Both passwords must match!', 400);
		}

		const user = await User.create({ name, email, password });

		const jwtUserModel: JWTUserModel = {
			id: user.id,
			name: user.name,
			email: user.email,
		};
		const token = this.signJWT(jwtUserModel);
		return token;
	}

	static async login(email: string, password: string): Promise<string> {
		if (!email || !password) {
			throw new CustomError('All fields are required', 400);
		}

		const user = await User.findOne({ email });
		if (!user) {
			throw new CustomError('No user found with this email', 400);
		}

		const passwordsMatch = await this.comparePassword(password, user.password);
		if (!passwordsMatch) {
			throw new CustomError("Passwords don't match", 400);
		}

		const jwtUserModel: JWTUserModel = {
			id: user.id,
			name: user.name,
			email: user.email,
		};
		const token = this.signJWT(jwtUserModel);

		return token;
	}

	static veritfyJWT(token: string): JWTUserModel {
		return jwt.verify(token, process.env.JWT_SECRET);
	}

	private static signJWT(user: JWTUserModel): string {
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
