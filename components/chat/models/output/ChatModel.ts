import { UserBaseModel } from '../../../user/models/output/UserBaseModel';

export interface ChatModel {
	id: string;
	isAnon: boolean;
	messages: {};
	currentUser: UserBaseModel;
	friendUser: UserBaseModel;
}
