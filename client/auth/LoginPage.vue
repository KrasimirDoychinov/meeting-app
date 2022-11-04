<template>
	<div class="login">
		<div class="login-heading">
			<h1>Login</h1>
		</div>
		<div class="login-form">
			<div class="login-form-row">
				<input v-model="email" type="text" placeholder="Email" />
			</div>
			<div class="login-form-row">
				<input v-model="password" type="password" placeholder="Password" />
			</div>
		</div>
		<button @click="login">Login</button>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { inject } from '@vue/runtime-core';

import axios from 'axios';

// non ref props
const loginEndpoint = '/auth/login';
const host = inject('host');

// ref props
const email = ref('');
const password = ref('');

// methods
const login = async () => {
	const response = await axios.post(host + loginEndpoint, {
		email: email.value,
		password: password.value,
	});

	console.log(response.data);
};
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.login {
	display: flex;
	flex-flow: column;
	align-items: center;
	height: 35%;
	width: 100%;
	background: linear-gradient($purple, $light-purple);
	border-radius: 6%;
	padding: 2em;

	&-heading {
		height: 40%;
	}

	&-form {
		display: flex;
		flex-flow: column;
		width: 100%;
		height: 60%;
		gap: 1em;

		&-row {
			input {
				color: black;
				width: 100%;
				height: 2em;
				border-radius: 23px;
				padding-left: 1em;
			}
		}
	}

	button {
		color: $dark;
		border: 1px solid;
		border-radius: 20px;
		font-size: 20px;
		padding: 0.5em 1em;
	}
}
</style>
