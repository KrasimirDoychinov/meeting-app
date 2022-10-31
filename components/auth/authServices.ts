const bcrypt = require('bcrypt');

export class AuthServices {
	// TODO: Register, login, verifyJWT, createJWT

	static register(
		name: string,
		email: string,
		password: string,
		compare: string
	) {
		this.verifyCreds(name, email, password, compare);
	}

	private static verifyCreds(
		name: string,
		email: string,
		password: string,
		compare: string
	) {
		if (!name || !email || !password || !compare) {
			throw new Error('All fields are required!');
		}

		if (password === compare) {
			throw new Error('Both passwords must match!');
		}
	}

	private static async comparePassword(
		canditatePassword: string,
		password: string
	) {
		return await bcrypt.compare(canditatePassword, password);
	}
}
