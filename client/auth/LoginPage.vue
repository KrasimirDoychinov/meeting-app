<template>
	<div class="auth">
		<div class="auth-heading">
			<h1>Login</h1>
		</div>
		<div class="auth-form">
			<div class="auth-form-row">
				<input v-model="email" type="text" placeholder="Email" />
			</div>
			<div class="auth-form-row">
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
import store from '../store/index';
import router from '../router.js';

import axios from 'axios';

// non ref props
const loginEndpoint = '/auth/login';
const host = store.state.host;

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
		router.push('/');
	} catch (error) {
		invalidMsg.value = error.response.data.msg;
	}
};
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/globals.scss';
@import '../scss/auth';
</style>
