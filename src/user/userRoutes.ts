import { authorize } from '../middlewares/middlewares';
import UserController from './userController';
import { container } from 'tsyringe';

import express from 'express';
export const userRouter = express.Router();

const controller = container.resolve(UserController);

userRouter.get('/', authorize, controller.allWithTags);
userRouter.get('/friends', authorize, controller.allFriends);
userRouter.get('/requests/friend', authorize, controller.friendNRequestsByUser);
userRouter.get('/notifications/chat', authorize, controller.chatNotificationsByUser);
userRouter.get('/byId/:id', authorize, controller.getForeignUser);

userRouter.delete(
	'/notifications/chat/:chatId',
	authorize,
	controller.removeChatNotificationsByChatId
);

userRouter.post('/friend/accept/:id', authorize, controller.acceptFriendRequest);
userRouter.post('/friend/:id', authorize, controller.sendFriendRequest);
userRouter.post('/real-data/initial', authorize, controller.initialRealData);
