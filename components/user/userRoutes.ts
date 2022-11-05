import { authorize } from '../middlewares/authorization';
import { addToFriend, all, friendNotificationsByUser } from './userController';

const express = require('express');
export const userRouter = express.Router();

userRouter.get('/', authorize, all);
userRouter.get('/notifications/friend', authorize, friendNotificationsByUser);
userRouter.post('/friend/:id', authorize, addToFriend);
