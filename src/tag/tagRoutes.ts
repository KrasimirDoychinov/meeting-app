import express from 'express';
import { container } from 'tsyringe';
import { authorize } from '../middlewares/middlewares';
import TagController from './tagContoller';
export const tagRouter = express.Router();

const controller = container.resolve(TagController);

tagRouter.post('/', authorize, controller.setTags);
