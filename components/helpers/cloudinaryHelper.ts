const cloudinary = require('cloudinary').v2;

export class CloudinaryHelper {
	static async getAvatar(): Promise<string> {
		const model = await this.getResources();
		return model;
	}

	static async uploadImage(img: string, imgName: string): Promise<any> {
		await cloudinary.uploader.upload(img, {
			public_id: `meeting-app/${imgName}`,
			tags: ['meeting-app'],
		});
		console.log(`Image uploaded: ${imgName}`);
	}

	// private
	private static async getResources(): Promise<any> {
		const result = await cloudinary.search
			.expression(`dsfghdfgasdfgdfghdfgh_hdfghdfgh_63724f6781e155de5744cc0e`)
			.max_results(499)
			.execute();

		console.log(result.resources.length);
		return result.resources;
		// return (await cloudinary.api.resources()).resources.map(
		// 	(x: any) => x.public_id
		// );
	}
}
