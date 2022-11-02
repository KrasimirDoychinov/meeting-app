import { authorize } from '../middlewares/authorization';
import { chatById, createChat } from './chatController';

const express = require('express');
export const chatRouter = express.Router();

chatRouter.get('/:id', authorize, chatById);
chatRouter.post('/create/:personId', authorize, createChat);
