import { authorize } from '../middlewares/authorization';
import { setTags } from './tagContoller';

const express = require('express');
export const tagRouter = express.Router();

tagRouter.post('/', authorize, setTags);
