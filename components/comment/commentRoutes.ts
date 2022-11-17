import { authorize } from '../middlewares/authorization';
import { allByPost, createComment } from './commentController';

import express from 'express';
export const commentRouter = express.Router();

commentRouter.post('/:postId', authorize, createComment);
commentRouter.get('/all/:postId', authorize, allByPost);
