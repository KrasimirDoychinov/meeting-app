import { UserBaseModel } from '../../../user/models/output/outputModels';
import { ChatBaseModel } from '../baseModels';

export interface ChatViewModel extends ChatBaseModel {
	currentUser?: UserBaseModel;
	friendUser?: UserBaseModel;
}

export interface ChatMessageViewModel {
	senderId: string;
	content: string;
}
