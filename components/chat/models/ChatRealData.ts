import { UserRealData } from '../../user/models/UserRealData';

export interface ChatRealData {
	personA: UserRealData;
	personB: UserRealData;
}
