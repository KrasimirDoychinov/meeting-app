import { Gender } from '../enums/genderEnums';

import * as mongoose from 'mongoose';
import { IUser } from './baseModels';

export const RealDataSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'Please provide a first name.'],
	},
	lastName: {
		type: String,
		required: [true, 'Please provide a last name.'],
	},
	imageUrl: {
		type: String,
		required: [true, 'Please provide an image.'],
	},
});

const FriendSchema = new mongoose.Schema({
	friendId: String,
	name: String,
	imageUrl: String,
	chatId: String,
	realData: RealDataSchema,
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

const UserSchema = new mongoose.Schema<IUser>({
	name: {
		type: String,
		required: [true, 'Please provide a name'],
		maxLength: 50,
		minLength: 3,
	},
	email: {
		type: String,
		required: [true, 'Please provide an email'],
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
