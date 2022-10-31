interface CustomError {
	statusCode: string;
	msg: string;
}

export const errorHandler = (err: any, req: any, res: any, next: any) => {
	const error: CustomError = {
		statusCode: err.statusCode || 500,
		msg: err.message || 'Something went wrong please try again',
	};

	return res.status(error.statusCode).json(error);
};
