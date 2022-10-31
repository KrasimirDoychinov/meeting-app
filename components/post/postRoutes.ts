import { authorize } from '../middlewares/authorization';
import { createPost, deletePost, likePost } from './postController';

const express = require('express');
export const postRouter = express.Router();

postRouter.post('/', authorize, createPost);
postRouter.post('/like/:id', authorize, likePost);
postRouter.delete('/:id', authorize, deletePost);
