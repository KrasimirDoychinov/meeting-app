import { AuthServices } from './authServices';

export const register = async (req: any, res: any) => {
	const { name, email, password, compare } = req.body;
	const token = await AuthServices.register(name, email, password, compare);

	res.status(200).json({ token });
};

export const login = async (req: any, res: any) => {
	const { email, password } = req.body;
	const token = await AuthServices.login(email, password);

	res.status(200).json({ token });
};
