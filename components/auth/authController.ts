import { AuthServices } from './authServices';

export const register = async (req, res) => {
	const result = await AuthServices.register(req.body);

	res.status(200).json(result);
};

export const login = async (req, res) => {
	const result = await AuthServices.login(req.body);

	res.status(200).json(result);
};
