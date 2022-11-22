import { injectable } from 'tsyringe';
import { CustomError } from '../errors/customError';
import { GlobalErrorConstants } from '../errors/errorConstants';
import { IRepository } from '../global/repository';
import { IChat } from './models/baseModels';
import { Chat } from './models/Chat';

@injectable()
export default class ChatRepository implements IRepository<IChat> {
	async findById(id: string): Promise<IChat> {
		const user: IChat | null = await Chat.findById(id);
		if (!user) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}
		return user!;
	}

	async find(query: {}): Promise<IChat[]> {
		const users: IChat[] = await Chat.find(query);
		if (!users || users.length === 0) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}

		return users;
	}

	async findOne(query: {}): Promise<IChat> {
		console.log(query);
		const user: IChat | null = await Chat.findOne(query);
		if (!user) {
			throw new CustomError(GlobalErrorConstants.NotFound, 400);
		}

		return user;
	}
}
