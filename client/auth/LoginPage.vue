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
			<p>{{ invalidMsg }}</p>
		</div>
		<button @click="login">Login</button>
		<h3>
			Don't have an account?
			<router-link class="red-color" to="/register">Register here</router-link>
		</h3>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { inject } from '@vue/runtime-core';
import store from '../store/index';

import axios from 'axios';

// non ref props
const loginEndpoint = '/auth/login';
const host = inject('host');

// ref props
const email = ref('');
const password = ref('');
const invalidMsg = ref('');

// methods
const login = async () => {
	try {
		const response = await axios.post(host + loginEndpoint, {
			email: email.value,
			password: password.value,
		});
		store.commit('setToken', response.data.token);
	} catch (error) {
		invalidMsg.value = error.response.data.msg;
	}
};
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/globals.scss';

.login {
	display: flex;
	flex-flow: column;
	align-items: center;
	width: 100%;
	background: linear-gradient($purple, $light-purple);
	border-radius: 6%;
	padding: 2em;

	&-heading {
		margin-bottom: 2em;
	}

	&-form {
		display: flex;
		flex-flow: column;
		width: 100%;
		gap: 1em;
		margin-bottom: 2em;

		&-row {
			input {
				color: black;
				width: 100%;
				height: 2.5em;
				border-radius: 23px;
				padding-left: 1em;
				border: 0px solid;
			}
		}
	}

	p {
		margin-top: 0.5em;
		color: $red;
	}

	button {
		color: $white;
		border: 0px solid;
		border-radius: 15px;
		font-size: 20px;
		padding: 0.5em 1em;
		background: $red;
		font-weight: bold;
		transition: 0.5s;

		&:hover {
			color: $red;
			background: $white;
			transition: 0.5s;
		}
	}

	h3 {
		margin-top: 1em;
		span {
			color: $red;
		}
	}
}
</style>
