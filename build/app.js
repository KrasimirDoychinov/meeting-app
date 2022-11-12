"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require('dotenv').config();
require('express-async-errors');
const authRoutes_1 = require("./components/auth/authRoutes");
const chatRoutes_1 = require("./components/chat/chatRoutes");
const chatServices_1 = require("./components/chat/chatServices");
const commentRoutes_1 = require("./components/comment/commentRoutes");
const errorHandler_1 = require("./components/middlewares/errorHandler");
const postRoutes_1 = require("./components/post/postRoutes");
const tagRoutes_1 = require("./components/tag/tagRoutes");
const userRoutes_1 = require("./components/user/userRoutes");
const connectDB_1 = require("./connectDB");
const cors = require('cors');
const bp = require('body-parser');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
exports.io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});
// socket.io
exports.io.on('connection', (socket) => {
    socket.on('create message', (chatId, content, userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
        if (content.length > 0) {
            const message = yield chatServices_1.ChatServices.createMessage(chatId, userId, friendId, content);
            exports.io.emit('create message', message);
        }
    }));
});
app.use(cors());
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
// routes
app.use('/api/auth', authRoutes_1.authRouter);
app.use('/api/post', postRoutes_1.postRouter);
app.use('/api/comment', commentRoutes_1.commentRouter);
app.use('/api/chat', chatRoutes_1.chatRouter);
app.use('/api/user', userRoutes_1.userRouter);
app.use('/api/tag', tagRoutes_1.tagRouter);
// middlewares
app.use(errorHandler_1.errorHandler);
// app start
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const port = process.env.PORT || 3000;
        const socketPort = process.env.SOCKET_PORT || 3001;
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/facebook-clone';
        yield (0, connectDB_1.connectDB)(mongoUri);
        app.listen(port, () => console.log(`Server listening on port: ${port}`));
        server.listen(socketPort, () => console.log(`Web socket server listening on port: ${3001}`));
    }
    catch (error) {
        console.log(error);
    }
});
start();
