import { UserAnonData } from './UserAnonData';
import { UserRealData } from './UserRealData';

export interface UserFullData extends UserAnonData {
	realData: UserRealData;
}
