import { authorize } from '../middlewares/authorization';
import {
	acceptFriendRequest,
	allWithTags,
	friendNRequestsByUser,
	sendFriendRequest,
} from './userController';

const express = require('express');
export const userRouter = express.Router();

userRouter.get('/', authorize, allWithTags);
userRouter.get('/requests/friend', authorize, friendNRequestsByUser);
userRouter.post('/friend/accept/:id', authorize, acceptFriendRequest);
userRouter.post('/friend/:id', authorize, sendFriendRequest);
