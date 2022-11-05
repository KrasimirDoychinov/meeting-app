import { authorize } from '../middlewares/authorization';
import { addToFriend, all } from './userController';

const express = require('express');
export const userRouter = express.Router();

userRouter.get('/', authorize, all);
userRouter.post('/friend/:id', authorize, addToFriend);
