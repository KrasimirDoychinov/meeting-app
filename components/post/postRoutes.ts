import { authorize } from '../middlewares/middlewares';
import {
	allByCreator,
	createPost,
	deletePost,
	likePost,
	updatePost,
} from './postController';

import express from 'express';
export const postRouter = express.Router();

postRouter.post('/', authorize, createPost);
postRouter.get('/', authorize, allByCreator);
postRouter.post('/like/:id', authorize, likePost);
postRouter.delete('/:id', authorize, deletePost);
postRouter.put('/:id', authorize, updatePost);
