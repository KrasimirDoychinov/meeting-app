const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide name'],
		maxlength: 50,
		minlength: 3,
	},
	password: {
		type: String,
		required: [true, 'Please provide password'],
		minlength: 6,
	},
});

UserSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});


export const User = mongoose.model('User', UserSchema);
