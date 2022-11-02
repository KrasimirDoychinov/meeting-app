const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide name'],
		maxlength: 50,
		minlength: 3,
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
		imageUrl: {
			type: String,
			required: false,
		},
	},
	avatarUrl: {
		type: String,
		default: 'Test url',
	},
	tags: [String],
});

UserSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model('User', UserSchema);
