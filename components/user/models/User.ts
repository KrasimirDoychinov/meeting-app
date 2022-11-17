import { Gender } from '../enums/genderEnums';

import * as mongoose from 'mongoose';

const RealDataSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: false,
	},
	lastName: {
		type: String,
		required: false,
	},
	imageUrl: {
		type: String,
		required: false,
	},
});

const FriendSchema = new mongoose.Schema({
	friendId: String,
	name: String,
	imageUrl: String,
	chatId: String,
	realData: {
		firstName: String,
		lastName: String,
		imageUrl: String,
	},
	isAnon: {
		type: Boolean,
		default: true,
	},
	notifications: {
		type: Number,
		default: 0,
	},
});

const FriendNotification = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});

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
	id: string;
	name: string;
}

export interface IUser extends mongoose.Document {
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

export interface RealData {
	firstName: string;
	lastName: string;
	imageUrl: string;
}

const UserSchema = new mongoose.Schema<IUser>({
	name: {
		type: String,
		required: [true, 'Please provide name'],
		maxLength: 50,
		minLength: 3,
	},
	email: {
		type: String,
		required: [true, 'Please provide email'],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please provide a valid email',
		],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide password'],
		minlength: 6,
	},
	realData: RealDataSchema,
	gender: {
		type: Number,
		enum: [Gender.Male, Gender.Female],
	},
	tags: [String],
	friends: [FriendSchema],
	friendNotifications: [FriendNotification],
	chatNotifications: [String],
});

export const User = mongoose.model('User', UserSchema);
