import { UserBaseModel } from './UserBaseModel';
import { UserRealData } from './UserRealData';

export interface UserFullModel extends UserBaseModel {
	realData: UserRealData;
}
