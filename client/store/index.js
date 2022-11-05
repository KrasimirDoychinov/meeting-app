import axios from 'axios';
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
		getBearer(state) {
			return `Bearer ${state.token}`;
		},
	},
	actions: {
		async login({ state, commit }, { email, password }) {
			const response = await axios.post(state.host + '/auth/login', {
				email,
				password,
			});
			commit('setToken', response.data.token);
		},
		async register({ state, commit }, { name, email, password, compare }) {
			const response = await axios.post(state.host + '/auth/register', {
				name,
				email,
				password,
				compare,
			});
			commit('setToken', response.data.token);
		},
		async allUsers({ state, getters, commit }) {
			const response = await axios.get(state.host + '/user', {
				headers: {
					Authorization: getters.getBearer,
				},
			});
			return response.data;
		},
	},
});
