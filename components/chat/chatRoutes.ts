import { authorize } from '../middlewares/middlewares';

import express from 'express';
import ChatController from './chatController';
export const chatRouter = express.Router();

const controller = new ChatController();

chatRouter.get('/:chatId', authorize, controller.chatById);
chatRouter.post('/create/:personId', authorize, controller.createChat);
chatRouter.post('/message/:id', authorize, controller.createMessage);
chatRouter.patch('/changeAnon/:id', authorize, controller.changeAnon);
chatRouter.patch(
	'/changeAnon/agree/:id',
	authorize,
	controller.changeAnonAgree
);
