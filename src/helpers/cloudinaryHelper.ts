import cloudinary from 'cloudinary';

export class CloudinaryHelper {
	static async getAvatar(): Promise<string> {
		const model = await cloudinary.v2.search
			.expression('tags=avatar')
			.execute();
		return model.resources[0].url;
	}

	static async uploadImage(img: string, imgName: string): Promise<any> {
		const result = await cloudinary.v2.uploader.upload(img, {
			public_id: `meeting-app/${imgName}`,
			tags: ['meeting-app'],
		});
		console.log(`Image uploaded: ${imgName}`);
		return result.url;
	}
}
