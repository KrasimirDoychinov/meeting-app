import { injectable } from 'tsyringe';
import { Repository } from '../global/repository';
import { IChat } from './models/baseModels';

@injectable()
export default class ChatRepository extends Repository<IChat> {
	constructor() {
		super('Chat');
	}
}
