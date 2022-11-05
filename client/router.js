import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './home/HomePage.vue';
import LoginPage from './auth/LoginPage.vue';
import RegisterPage from './auth/RegisterPage.vue';
import HeaderFull from './global/HeaderFull.vue';
import store from './store';

export default createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/login',
			name: 'Login',
			component: LoginPage,
			beforeEnter: (to, from, next) => {
				if (store.state.token) {
					next('/');
				} else {
					next();
				}
			},
		},
		{
			path: '/register',
			name: 'Register',
			component: RegisterPage,
			beforeEnter: (to, from, next) => {
				if (store.state.token) {
					next('/');
				} else {
					next();
				}
			},
		},
		{
			path: '/',
			name: 'Home',
			components: {
				default: HomePage,
				header: HeaderFull,
			},
			beforeEnter: (to, from, next) => {
				if (!store.state.token) {
					next('/login');
				} else {
					next();
				}
			},
		},
		{
			path: '/logout',
			name: 'Logout',
		},
	],
});
