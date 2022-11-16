import { login, register } from './authController';

import * as express from 'express';
export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
