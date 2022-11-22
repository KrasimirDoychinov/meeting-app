import * as express from 'express';
import AuthController from './authController';
export const authRouter = express.Router();

const controller = new AuthController();

authRouter.post('/register', controller.register);
authRouter.post('/login', controller.login);
