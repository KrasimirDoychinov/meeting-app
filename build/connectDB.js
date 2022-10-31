"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose = require('mongoose');
const connectDB = (uri) => {
    return mongoose
        .connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
        .then(() => console.log(`Connected to MongoDB: ${uri}`));
};
exports.connectDB = connectDB;
