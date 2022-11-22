import express from 'express';
import { authorize } from '../middlewares/middlewares';
import TagController from './tagContoller';
export const tagRouter = express.Router();

const controller = new TagController();

tagRouter.post('/', authorize, controller.setTags);
