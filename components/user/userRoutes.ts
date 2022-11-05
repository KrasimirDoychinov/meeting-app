import { authorize } from '../middlewares/authorization';
import { addToFriend, all, friendNRequestsByUser } from './userController';

const express = require('express');
export const userRouter = express.Router();

userRouter.get('/', authorize, all);
userRouter.get('/requests/friend', authorize, friendNRequestsByUser);
userRouter.post('/friend/:id', authorize, addToFriend);
