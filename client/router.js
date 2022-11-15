import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './home/HomePage.vue';
import LoginPage from './auth/LoginPage.vue';
import RegisterPage from './auth/RegisterPage.vue';
import HeaderFull from './global/HeaderFull.vue';
import ChatsPage from './chat/ChatsPage.vue';
import TagsInitialPage from './tags/TagsInitialPage.vue';
import FriendRequestPage from './requests/FriendRequestPage.vue';
import RealDataPage from './auth/RealDataPage.vue';

import store from './store';

export default createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/login',
			name: 'Login',
			components: {
				default: LoginPage,
			},
			beforeEnter: (to, from, next) => {
				if (isJwtValid(store.state.token, store.state.exp)) {
					next('/');
				}
				next();
			},
		},
		{
			path: '/register',
			name: 'Register',
			components: {
				default: RegisterPage,
			},
			beforeEnter: (to, from, next) => {
				if (isJwtValid(store.state.token, store.state.exp)) {
					next('/');
				}
				next();
			},
		},
		{
			path: '/real-data/initial',
			name: 'Real Data Initial',
			components: {
				default: RealDataPage,
			},
			// beforeEnter: async (to, from, next) => {
			// 	if (store.getters.hasTags) {
			// 		isAuthorized(store.state.token, store.state.exp, next, '/');
			// 	} else {
			// 		isAuthorized(store.state.token, store.state.exp, next);
			// 	}
			// },
		},
		{
			path: '/tags/initial',
			name: 'Tags Initial',
			components: {
				default: TagsInitialPage,
			},
			beforeEnter: async (to, from, next) => {
				if (store.getters.hasTags) {
					isAuthorized(store.state.token, store.state.exp, next, '/');
				} else {
					isAuthorized(store.state.token, store.state.exp, next);
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
				isAuthorized(store.state.token, store.state.exp, next);
			},
		},
		{
			path: '/chat',
			name: 'Chat',
			components: {
				default: ChatsPage,
				header: HeaderFull,
			},
			beforeEnter: (to, from, next) => {
				isAuthorized(store.state.token, store.state.exp, next);
			},
		},
		{
			path: '/requests/friend',
			name: 'Friend Requests',
			components: {
				default: FriendRequestPage,
				header: HeaderFull,
			},
			beforeEnter: (to, from, next) => {
				isAuthorized(store.state.token, store.state.exp, next);
			},
		},
	],
});

const isAuthorized = (token, exp, next, to) => {
	if (isJwtValid(token, exp)) {
		next(to);
	} else {
		next('/login');
	}
};

const isJwtValid = (token, exp) => {
	if (token && exp > Date.now()) {
		return true;
	}

	return false;
};
