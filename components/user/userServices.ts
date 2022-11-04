import { User } from './models/User';
import { UserFullData } from './models/UserFullData';

export class UserServices {
	static async byId(id: string): Promise<UserFullData> {
		const user = await User.findById(id);
		const model: UserFullData = {
			id: user._id,
			name: user.name,
			avatarUrl: user.avatarUrl,
			realData: {
				firstName: user.realData.firstName,
				lastName: user.realData.lastName,
				imageUrl: user.realData.imageUrl,
			},
			messages: user.messages,
		};
		return model;
	}
}
