import { authorize } from '../middlewares/authorization';
import {
	allByCreator,
	createPost,
	deletePost,
	likePost,
	updatePost,
} from './postController';

const express = require('express');
export const postRouter = express.Router();

postRouter.post('/', authorize, createPost);
postRouter.get('/', authorize, allByCreator);
postRouter.post('/like/:id', authorize, likePost);
postRouter.delete('/:id', authorize, deletePost);
postRouter.put('/:id', authorize, updatePost);
