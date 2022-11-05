import { authorize } from '../middlewares/authorization';
import { all } from './userController';

const express = require('express');
export const userRouter = express.Router();

userRouter.get('/', authorize, all);
