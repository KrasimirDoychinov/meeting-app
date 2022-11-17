import { authorize } from '../middlewares/authorization';
import {
	acceptFriendRequest,
	allFriends,
	allWithTags,
	chatNotificationsByUser,
	friendNRequestsByUser,
	initialRealData,
	removeChatNotificationsByChatId,
	sendFriendRequest,
} from './userController';

import express from 'express';
export const userRouter = express.Router();

userRouter.get('/', authorize, allWithTags);
userRouter.get('/friends', authorize, allFriends);
userRouter.get('/requests/friend', authorize, friendNRequestsByUser);
userRouter.get('/notifications/chat', authorize, chatNotificationsByUser);
userRouter.delete(
	'/notifications/chat/:chatId',
	authorize,
	removeChatNotificationsByChatId
);
userRouter.post('/friend/accept/:id', authorize, acceptFriendRequest);
userRouter.post('/friend/:id', authorize, sendFriendRequest);
userRouter.post('/real-data/initial', authorize, initialRealData);
