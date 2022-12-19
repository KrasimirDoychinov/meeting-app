import { authorize } from '../middlewares/middlewares';
import { allByPost, createComment } from './commentController';

import express from 'express';
export const commentRouter = express.Router();

