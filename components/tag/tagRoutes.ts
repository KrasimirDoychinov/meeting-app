import { authorize } from '../middlewares/authorization';

import express from 'express';
import TagController from './tagContoller';
export const tagRouter = express.Router();

const controller = new TagController();

tagRouter.post('/', authorize, controller.setTags);
