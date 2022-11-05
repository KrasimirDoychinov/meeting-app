import { createStore } from 'vuex';

export default createStore({
	state: {
		host: 'http://localhost:3000/api',
		token: '',
	},
	mutations: {
		setToken(state, token) {
			state.token = token;
			console.log(`Token is set to ${token}`);
		},
		removeToken(state) {
			state.token = '';
		},
	},
	getters: {
		isLoggedIn(state) {
			return state.token.length === 0 ? false : true;
		},
	},
});
