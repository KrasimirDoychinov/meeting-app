import { UserAnonData } from '../../user/models/UserAnonData';

export interface ChatAnonData {
	id: string;
	messages: {};
	personA: UserAnonData;
	personB: UserAnonData;
}
