import { UserRealData } from '../../../user/models/output/UserRealData';

export interface ChatRealModel {
	id: string;
	messages: {};
	personA: UserRealData;
	personB: UserRealData;
}
