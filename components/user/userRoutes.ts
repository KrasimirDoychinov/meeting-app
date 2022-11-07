import { authorize } from '../middlewares/authorization';
import {
	acceptFriendRequest,
	addToFriend,
	all,
	friendNRequestsByUser,
} from './userController';

const express = require('express');
export const userRouter = express.Router();

userRouter.get('/', authorize, all);
userRouter.get('/requests/friend', authorize, friendNRequestsByUser);
userRouter.post('/friend/accept/:id', authorize, acceptFriendRequest);
userRouter.post('/friend/:id', authorize, addToFriend);
