import { UserRealData } from '../../user/models/UserRealData';

export interface ChatRealData {
	id: string;
	messages: {};
	personA: UserRealData;
	personB: UserRealData;
}
