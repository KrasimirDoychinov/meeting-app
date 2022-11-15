import axios from 'axios';
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
	state: {
		host: 'http://localhost:3000/api',
		token: '',
		tags: [],
		exp: 0,
		userId: '',
		currentChatId: '',
		chatNotifications: 0,
	},
	mutations: {
		setToken(state, data) {
			state.token = data.token;
			state.exp = data.exp * 1000;
			state.userId = data.id;
		},
		removeToken(state) {
			state.token = '';
			state.exp = 0;
			state.userId = '';
		},
		setTags(state, value) {
			state.tags = value;
		},
		removeTags(state) {
			state.tags = [];
		},
		setChatId(state, value) {
			state.currentChatId = value;
		},
		removeChatId(state) {
			state.currentChatId = null;
		},
		setChatNotifications(state, value) {
			state.chatNotifications = value;
		},
		removeChatNotifications(state, value) {
			state.chatNotifications -= value;
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
			await commit('setTags', response.data.tags);
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
		async createRealData({ state, getters }, { firstName, lastName, img }) {
			const response = await axios.post(
				state.host + '/user/real-data/initial',
				{
					firstName,
					lastName,
					img,
				},
				{
					headers: Object.assign(getters.getHeaders),
				}
			);

			return response.data;
		},
		async allUsersByTag({ state, getters }, { tags }) {
			const response = await axios.get(
				state.host + `/user/?tags=${tags.join('|')}`,
				{
					headers: getters.getHeaders,
				}
			);
			return response.data;
		},
		async friendRequestsByUser({ state, getters, commit }) {
			const response = await axios.get(state.host + `/user/requests/friend`, {
				headers: getters.getHeaders,
			});
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
		async allFriends({ state, getters }) {
			const response = await axios.get(state.host + '/user/friends', {
				headers: getters.getHeaders,
			});
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
		// chat
		async chatById({ state, getters }, { chatId, friendId }) {
			const response = await axios.get(
				state.host + `/chat/${chatId}?friendId=${friendId}`,
				{
					headers: getters.getHeaders,
				}
			);

			return response.data;
		},
		async sendMessage({ state, getters }, { chatId, friendId, content }) {
			const response = await axios.post(
				state.host + `/chat/message/${chatId}`,
				{ content, friendId },
				{ headers: getters.getHeaders }
			);
			return response.data;
		},
		async chatNotificationsByUser({ state, getters }) {
			const response = await axios.get(
				state.host + '/user/notifications/chat',
				{
					headers: getters.getHeaders,
				}
			);

			return response.data;
		},
		async removeChatNotificationsByChatId(
			{ state, getters, commit },
			{ count, chatId }
		) {
			const response = await axios.delete(
				state.host + `/user/notifications/chat/${chatId}`,
				{
					headers: getters.getHeaders,
				}
			);
			await commit('removeChatNotifications', count);
			return response.data;
		},
		async changeAnonAgree({ state, getters }, { chatId }) {
			const response = await axios.patch(
				state.host + `/chat/changeAnon/agree/${chatId}`,
				{},
				{
					headers: getters.getHeaders,
				}
			);

			return response.data;
		},
	},
	plugins: [createPersistedState()],
});
