<template>
	<div class="auth">
		<div class="auth-heading">
			<h1>Register</h1>
		</div>
		<div class="auth-form">
			<div class="auth-form-row">
				<input v-model="name" type="text" placeholder="Name" />
			</div>
			<div class="auth-form-row">
				<input v-model="email" type="text" placeholder="Email" />
			</div>
			<div class="auth-form-row">
				<input v-model="password" type="password" placeholder="Password" />
			</div>
			<div class="auth-form-row">
				<input
					v-model="compare"
					type="password"
					placeholder="Confirm password"
				/>
			</div>
			<p>{{ invalidMsg }}</p>
		</div>
		<button @click="register">Register</button>
		<h3>
			Already have an account?
			<router-link class="red-color" to="/login">Login here</router-link>
		</h3>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import store from '../store/index.js';
import router from '../router.js';
import axios from 'axios';

// no ref props
const registerEndpoint = '/auth/register';
const host = store.state.host;

// ref props
const name = ref('');
const email = ref('');
const password = ref('');
const compare = ref('');
const invalidMsg = ref('');

// methods
const register = async () => {
	try {
		const response = await axios.post(host + registerEndpoint, {
			name: name.value,
			email: email.value,
			password: password.value,
			compare: compare.value,
		});

		store.commit('setToken', response.data.token);
		router.push('/');
	} catch (error) {
		console.log(error.response.data);
		invalidMsg.value = error.response.data.msg;
	}
};
</script>

<style lang="scss">
@import '../scss/variables';
@import '../scss/globals';
@import '../scss/auth';
</style>
