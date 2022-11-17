import { authorize } from '../middlewares/authorization';
import { setTags } from './tagContoller';

import express from 'express';
export const tagRouter = express.Router();

tagRouter.post('/', authorize, setTags);
