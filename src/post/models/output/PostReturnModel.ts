export interface PostReturnModel {
	creator: {
		id: string;
		name: string;
		imageUrl: string;
	};
	description: string;
	imageUrl: string;
	likes: string[];
}
