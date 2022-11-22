import { injectable } from 'tsyringe';
import { Repository } from '../database/repository';
import { IChat } from './models/baseModels';
import { ChatSchema } from './models/Chat';

@injectable()
export default class ChatRepository extends Repository<IChat> {
	constructor() {
		super('Chat', ChatSchema);
	}
}
