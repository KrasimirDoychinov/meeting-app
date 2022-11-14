import { Gender } from '../enums/genderEnums';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
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
	realData: {
		firstName: {
			type: String,
			required: false,
		},
		lastName: {
			type: String,
			required: false,
		},
		imageName: {
			type: String,
			required: false,
		},
	},
	gender: {
		type: Number,
		enum: [Gender.Male, Gender.Female],
	},
	tags: [String],
	friends: [
		{
			friendId: String,
			name: String,
			imageName: String,
			chatId: String,
			realData: {
				firstName: String,
				lastName: String,
				imageName: String,
			},
			isAnon: {
				type: Boolean,
				default: true,
			},
			notifications: {
				type: Number,
				default: 0,
			},
		},
	],
	friendNotifications: [
		{
			id: {
				type: String,
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
		},
	],
	chatNotifications: [String],
});

export const User = mongoose.model('User', UserSchema);
