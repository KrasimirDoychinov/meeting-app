import { UserBaseModel } from '../../../user/models/output/UserBaseModel';
import { ChatBaseModel } from '../baseModels';

export interface ChatReturnModel extends ChatBaseModel {
	currentUser?: UserBaseModel;
	friendUser?: UserBaseModel;
}

export interface ChatReturnMessageModel {
	senderId: string;
	content: string;
}
