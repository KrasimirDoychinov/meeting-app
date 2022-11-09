import { UserBaseModel } from '../../../user/models/output/UserBaseModel';

export interface ChatAnonModel {
	id: string;
	messages: {};
	personA: UserBaseModel;
	personB: UserBaseModel;
}
