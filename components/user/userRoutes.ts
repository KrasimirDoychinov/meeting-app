import { authorize } from '../middlewares/authorization';
import {
	acceptFriendRequest,
	allFriends,
	allWithTags,
	chatNotificationsByUser,
	friendNRequestsByUser,
	initialRealData,
	sendFriendRequest,
} from './userController';

const express = require('express');
export const userRouter = express.Router();

userRouter.get('/', authorize, allWithTags);
userRouter.get('/friends', authorize, allFriends);
userRouter.get('/requests/friend', authorize, friendNRequestsByUser);
userRouter.get('/notifications/chat', authorize, chatNotificationsByUser);
userRouter.post('/friend/accept/:id', authorize, acceptFriendRequest);
userRouter.post('/friend/:id', authorize, sendFriendRequest);
userRouter.post('/real-data/initial', authorize, initialRealData);
