export interface PostReturnModel {
	id: string;
	creator: {
		id: string;
		name: string;
		imageUrl: string;
	};
	description: string;
	imageUrl: string;
	likes: string[];
	comments: {
		creator: {
			id: string;
			name: string;
		};
		content: string;
	}[];
}
