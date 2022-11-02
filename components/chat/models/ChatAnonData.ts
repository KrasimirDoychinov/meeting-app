import { UserAnonData } from '../../user/models/UserAnonData';

export interface ChatAnonData {
	personA: UserAnonData;
	personB: UserAnonData;
}
