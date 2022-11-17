export class EnvHelper {
	static JwtSecret = process.env.JWT_SECRET as string;
	static JwtLifetime = process.env.JWT_LIFETIME as string;
}
