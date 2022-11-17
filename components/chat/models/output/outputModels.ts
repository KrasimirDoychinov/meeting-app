import { UserBaseModel } from '../../../user/models/output/outputModels';
import { ChatBaseModel } from '../baseModels';

export interface ChatReturnModel extends ChatBaseModel {
	currentUser?: UserBaseModel;
	friendUser?: UserBaseModel;
}

export interface ChatReturnMessageModel {
	senderId: string;
	content: string;
}
