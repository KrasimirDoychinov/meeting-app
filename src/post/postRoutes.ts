import { authorize } from '../middlewares/middlewares';
import PostController from './postController';

import express from 'express';
import { container } from 'tsyringe';
export const postRouter = express.Router();

const controller = container.resolve(PostController);

postRouter.get('/', authorize, controller.allByTags);
postRouter.post('/', authorize, controller.createPost);
postRouter.post('/comment/:id', authorize, controller.createComment);
postRouter.post('/like/:id', authorize, controller.likePost);
postRouter.delete('/:id', authorize, controller.deletePost);
postRouter.put('/:id', authorize, controller.editPost);
