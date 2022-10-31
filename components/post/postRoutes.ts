import { authorize } from '../middlewares/authorization';
import { createPost, likePost } from './postController';

const express = require('express');
export const postRouter = express.Router();

postRouter.post('/', authorize, createPost);
postRouter.post('/like/:id', authorize, likePost);
