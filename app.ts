import 'reflect-metadata';

require('dotenv').config();
import 'express-async-errors';

import { authRouter } from './src/auth/authRoutes';
import { chatRouter } from './src/chat/chatRoutes';
import { commentRouter } from './src/comment/commentRoutes';
import { IoHelper } from './src/helpers/socketHelper.io';
import { postRouter } from './src/post/postRoutes';
import { tagRouter } from './src/tag/tagRoutes';
import { userRouter } from './src/user/userRoutes';
import { connectDB } from './connectDB';

import cors from 'cors';
import bp from 'body-parser';
import fileUpload from 'express-fileupload';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

import { Server } from 'socket.io';
import cloudinary from 'cloudinary';
import { errorHandler } from './src/middlewares/middlewares';
import { RedisClient } from './src/database/redisClient';

export const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
	},
});
// socket.io
const ioHelper = new IoHelper(io);

// cloudinary
cloudinary.v2.config({
	cloud_name: 'detha4545',
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

app.use(cors());
app.use(fileUpload());
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

// routes
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);
app.use('/api/tag', tagRouter);

// middlewares
app.use(errorHandler);

// app start
const start = async () => {
	try {
		const redisClient = new RedisClient();
		await redisClient.connect();

		const port = process.env.PORT || 3000;
		const socketPort = process.env.SOCKET_PORT || 3001;
		const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/facebook-clone';
		await connectDB(mongoUri);
		app.listen(port, () => console.log(`Server listening on port: ${port}`));
		server.listen(socketPort, () =>
			console.log(`Web socket server listening on port: ${3001}`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();

class Test {
	get name() {
		return 'Qkoto';
	}
}
