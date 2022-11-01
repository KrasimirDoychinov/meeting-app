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
require('dotenv').config();
require('express-async-errors');
const authRoutes_1 = require("./components/auth/authRoutes");
const commentRoutes_1 = require("./components/comment/commentRoutes");
const errorHandler_1 = require("./components/middlewares/errorHandler");
const postRoutes_1 = require("./components/post/postRoutes");
const connectDB_1 = require("./connectDB");
const bp = require('body-parser');
const express = require('express');
const app = express();
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
// routes
app.use('/api/auth', authRoutes_1.authRouter);
app.use('/api/post', postRoutes_1.postRouter);
app.use('/api/comment', commentRoutes_1.commentRouter);
// middlewares
app.use(errorHandler_1.errorHandler);
// app start
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const port = process.env.PORT || 3000;
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/facebook-clone';
        yield (0, connectDB_1.connectDB)(mongoUri);
        app.listen(port, () => console.log(`Server listening on port: ${port}`));
    }
    catch (error) {
        console.log(error);
    }
});
start();
