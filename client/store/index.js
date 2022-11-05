import { createStore } from 'vuex';

export default createStore({
	state: {
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
});
