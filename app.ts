import { connectDB } from './connectDB';

require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

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
