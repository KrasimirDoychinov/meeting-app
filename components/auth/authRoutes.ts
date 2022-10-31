import { login, register } from './authController';

const express = require('express');
export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
