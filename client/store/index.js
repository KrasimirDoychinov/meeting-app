import axios from 'axios';
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
	state: {
		host: 'http://localhost:3000/api',
		token: '',
		tags: [],
		exp: 0,
		notificationCount: 0,
	},
	mutations: {
		setToken(state, data) {
			state.token = data.token;
			state.exp = data.exp * 1000;
			console.log(`Token is set to ${data.token}`);
		},
		removeToken(state) {
			state.token = '';
			state.exp = 0;
		},
		setTags(state, value) {
			state.tags = value;
		},
		removeTags(state) {
			state.tags = [];
		},
		setNotificationCount(state, value) {
			state.notificationCount = value;
		},
		removeOneNotification(state) {
			state.notificationCount--;
		},
	},
	getters: {
		isLoggedIn(state) {
			return state.token.length === 0 ? false : true;
		},
		getHeaders(state) {
			return { Authorization: `Bearer ${state.token}` };
		},
		hasTags(state) {
			return state.tags.length >= 3;
		},
	},
	actions: {
		// auth
		async login({ state, commit }, { email, password }) {
			const response = await axios.post(state.host + '/auth/login', {
				email,
				password,
			});
			await commit('setToken', response.data);
		},
		async register({ state, commit }, { name, email, password, compare }) {
			const response = await axios.post(state.host + '/auth/register', {
				name,
				email,
				password,
				compare,
			});
			await commit('setToken', response.data);
		},
		async checkToken({ state, getters }) {
			const response = await axios.get(state.host + '/auth', {
				headers: getters.getHeaders,
			});
			return response.data;
		},
		// user
		async allUsers({ state, getters }) {
			const response = await axios.get(state.host + '/user', {
				headers: getters.getHeaders,
			});
			return response.data;
		},
		async friendRequestsByUser({ state, getters, commit }) {
			const response = await axios.get(state.host + `/user/requests/friend`, {
				headers: getters.getHeaders,
			});
			await commit('setNotificationCount', response.data.count);
			return response.data;
		},
		async addFriend({ state, getters, commit }, { id }) {
			const response = await axios.post(
				state.host + `/user/friend/${id}`,
				{},
				{
					headers: getters.getHeaders,
				}
			);
			await commit('removeOneNotification');
			return response.data;
		},
		async acceptFriendRequest({ state, getters }, { id }) {
			const response = await axios.post(
				state.host + `/user/friend/accept/${id}`,
				{},
				{
					headers: getters.getHeaders,
				}
			);
			return response.data;
		},
		// tag
		async setTags({ state, getters, commit }, { tags }) {
			const response = await axios.post(
				state.host + '/tag',
				{
					tags,
				},
				{
					headers: getters.getHeaders,
				}
			);
			await commit('setTags', tags);
			return response.data;
		},
	},
	plugins: [createPersistedState()],
});
