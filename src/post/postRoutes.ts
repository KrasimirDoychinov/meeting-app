import { authorize } from '../middlewares/middlewares';
import PostController from './postController';

import express from 'express';
export const postRouter = express.Router();

const controller = new PostController();

postRouter.post('/', authorize, controller.createPost);
postRouter.get('/', authorize, controller.allByCreator);
postRouter.post('/like/:id', authorize, controller.likePost);
postRouter.delete('/:id', authorize, controller.deletePost);
postRouter.put('/:id', authorize, controller.updatePost);
