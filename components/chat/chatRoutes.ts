import { authorize } from '../middlewares/authorization';
import {
	changeAnon,
	changeAnonAgree,
	chatById,
	createChat,
	createMessage,
} from './chatController';

const express = require('express');
export const chatRouter = express.Router();

chatRouter.get('/:chatId', authorize, chatById);
chatRouter.post('/create/:personId', authorize, createChat);
chatRouter.post('/message/:id', authorize, createMessage);
chatRouter.patch('/changeAnon/:id', authorize, changeAnon);
chatRouter.patch('/changeAnon/agree/:id', authorize, changeAnonAgree);
