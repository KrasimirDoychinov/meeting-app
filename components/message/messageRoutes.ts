import { authorize } from '../middlewares/authorization';
import { allByChat, createMessage } from './messageController';

const express = require('express');
export const messageRouter = express.Router();

messageRouter.post('/create/:chatId', authorize, createMessage);
messageRouter.get('/all/:chatId', authorize, allByChat);
