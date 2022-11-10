import { UserBaseModel } from '../../../user/models/output/UserBaseModel';
import { UserRealData } from '../../../user/models/output/UserRealData';

export interface ChatRealModel {
	id: string;
	isAnon: boolean;
	messages: {};
	personA: UserBaseModel;
	personB: UserBaseModel;
}
