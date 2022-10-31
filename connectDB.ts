const mongoose = require('mongoose');

export const connectDB = (uri: string) => {
	return mongoose
		.connect(uri, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		})
		.then(() => console.log(`Connected to MongoDB: ${uri}`));
};
