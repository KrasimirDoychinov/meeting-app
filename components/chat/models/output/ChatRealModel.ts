import { UserBaseModel } from '../../../user/models/output/UserBaseModel';

export interface ChatRealModel {
	id: string;
	isAnon: boolean;
	messages: {};
	personA: UserBaseModel;
	personB: UserBaseModel;
}
