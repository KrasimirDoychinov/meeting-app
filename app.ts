require('dotenv').config();
require('express-async-errors');

import { authRouter } from './components/auth/authRoutes';
import { chatRouter } from './components/chat/chatRoutes';
import { commentRouter } from './components/comment/commentRoutes';
import { errorHandler } from './components/middlewares/errorHandler';
import { postRouter } from './components/post/postRoutes';
import { userRouter } from './components/user/userRoutes';
import { connectDB } from './connectDB';

const cors = require('cors');
const bp = require('body-parser');
const express = require('express');
const app = express();

app.use(cors());
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

// routes
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);
// middlewares

app.use(errorHandler);
// app start
const start = async () => {
	try {
		const port = process.env.PORT || 3000;
		const mongoUri =
			process.env.MONGO_URI || 'mongodb://localhost:27017/facebook-clone';
		await connectDB(mongoUri);
		app.listen(port, () => console.log(`Server listening on port: ${port}`));
	} catch (error) {
		console.log(error);
	}
};

start();
