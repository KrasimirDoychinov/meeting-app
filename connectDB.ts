const mongoose = require('mongoose');

export const connectDB = async (uri: string) => {
	try {
		const test = mongoose
			.connect(uri, {
				useUnifiedTopology: true,
				useNewUrlParser: true,
			})
			.then(() => console.log(`Connected to MongoDB: ${uri}`))
			.catch((err: any) => console.log(err));
	} catch (error) {
		console.log(error);
	}

	return '';
};
