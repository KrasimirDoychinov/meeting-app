import { BaseEntity } from '../../database/baseEntity';
import { Gender } from '../enums/genderEnums';

export interface Friend {
	friendId: string;
	name: string;
	imageUrl: string;
	chatId: string;
	realData: {
		firstName: string;
		lastName: string;
		imageUrl: string;
	};
	isAnon: boolean;
	notifications: number;
}

export interface FriendNotification {
	friendId: string;
	name: string;
}

export interface RealData {
	firstName: string;
	lastName: string;
	imageUrl: string;
}

export interface IUser extends BaseEntity {
	name: string;
	email: string;
	password: string;
	realData: RealData;
	gender: Gender;
	tags: string[];
	friends: Friend[];
	friendNotifications: FriendNotification[];
	chatNotifications: string[];
}
