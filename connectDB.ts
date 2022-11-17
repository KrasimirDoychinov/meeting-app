import * as mongoose from 'mongoose';

export const connectDB = async (uri: string) => {
	try {
		mongoose
			.connect(uri, {})
			.then(() => console.log(`Connected to MongoDB: ${uri}`))
			.catch((err: any) => console.log(err));
	} catch (error) {
		console.log(error);
	}

	return '';
};
