import { CustomError } from '../errors/customError';

const express = require('express');
export const authRouter = express.Router();

authRouter.post('/register', () => {
	throw new CustomError('Test', 400);
});
authRouter.post('/login');
