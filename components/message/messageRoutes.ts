import { authorize } from '../middlewares/authorization';
import { createMessage } from './messageController';

const express = require('express');
export const messageRouter = express.Router();

messageRouter.post('/create/:chatId', authorize, createMessage);
