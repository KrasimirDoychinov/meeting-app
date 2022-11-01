import { authorize } from '../middlewares/authorization';
import { createChat } from './chatController';

const express = require('express');
export const chatRouter = express.Router();

chatRouter.post('/create/:personId', authorize, createChat);
