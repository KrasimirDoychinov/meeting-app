import { createRouter, createWebHashHistory } from 'vue-router';
import LoginPage from './auth/LoginPage.vue';
import RegisterPage from './auth/RegisterPage.vue';

export default createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/login',
			name: 'Login',
			component: LoginPage,
		},
		{
			path: '/register',
			name: 'Register',
			component: RegisterPage,
		},
	],
});
