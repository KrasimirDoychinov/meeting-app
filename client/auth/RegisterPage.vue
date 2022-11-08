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
import { useRouter } from 'vue-router';
import store from '../store/index.js';

const router = useRouter();
// ref props
const name = ref('');
const email = ref('');
const password = ref('');
const compare = ref('');
const invalidMsg = ref('');

// methods
const register = async () => {
	try {
		await store.dispatch('register', {
			name: name.value,
			email: email.value,
			password: password.value,
			compare: compare.value,
			invalidMsg,
		});
		router.push('/tags/initial');
	} catch (error) {
		invalidMsg.value = error.response.data.msg;
	}
};
</script>

<style lang="scss">
@import '../scss/variables';
@import '../scss/globals';
@import '../scss/auth';
</style>
