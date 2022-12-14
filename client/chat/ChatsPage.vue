<template>
	<div class="chats">
		<div
			v-show="!chatIsOpen"
			class="users"
		>
			<div
				v-for="(user, index) in users.value"
				:key="index"
				class="user-box"
			>
				<div
					v-if="user.notificationCount"
					:count="user.notificationCount"
					class="user-box-bubble notifications"
				>
					<img
						class="avatar-img"
						@click="
							openChat(
								user.chatId,
								user.id,
								user.imageUrl,
								user.notificationCount
							)
						"
						:src="user.imageUrl"
						alt=""
					/>
					{{ user.name }}
				</div>
				<div
					v-else
					class="user-box-bubble"
				>
					<img
						class="avatar-img"
						@click="openChat(user.chatId, user.id, user.imageUrl)"
						:src="user.imageUrl"
						alt=""
					/>
					{{ user.name }}
				</div>
			</div>
		</div>
		<div
			v-show="chatIsOpen"
			class="current-user"
		>
			<img
				class="avatar-img"
				:src="currentChatFriend.imageUrl"
				alt=""
			/>
			{{ currentChatFriend.name }}
		</div>
		<div
			class="chat"
			v-show="chatIsOpen"
			:class="chatIsOpen ? 'open' : ''"
		>
			<i
				@click="hideChat"
				class="close fa-solid fa-x"
			></i>
			<button
				v-if="!currentChatUser.changeAnonAgree"
				@click="sendMeetRequest(currentChat.id)"
				class="btn meet-btn"
			>
				Meet!
			</button>
			<div class="main-chat">
				<div
					v-for="(message, index) in currentChat.messages"
					:key="index"
					:class="message.senderId === userId ? 'user' : 'friend'"
					class="message"
				>
					<p>{{ message.content }}</p>
				</div>
			</div>
			<div class="send-message">
				<textarea
					v-model="message"
					name=""
					id=""
					cols="30"
					rows="10"
				></textarea>
				<button
					@click="sendMessage(currentChat.id)"
					class="btn send-btn"
				>
					Send
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onBeforeMount, onBeforeUnmount, ref } from '@vue/runtime-core';
	import store from '../store/index.js';

	// props
	const emit = defineEmits(['forceRerenderHeader']);
	const users = ref([]);
	const chatIsOpen = ref(false);

	const currentChat = ref({});
	const currentChatUser = ref({});
	const currentChatFriend = ref({});
	const userId = ref(store.state.userId);

	const message = ref('');
	// methods
	const openChat = async (chatId, friendId, img, notificationCount) => {
		const chat = await store.dispatch('chatById', { chatId, friendId });
		chat.messages = chat.messages.reverse();

		currentChatFriend.value = chat.friendUser;
		currentChatFriend.value.imageUrl = img;
		currentChatUser.value = chat.currentUser;

		currentChat.value = chat;
		chatIsOpen.value = true;

		// notify backend if a notification needs to be created
		await socket.emit('chat connection');
		// waits for the backend to add the msg dynamically to the frontend
		await socket.off('create message').on('create message', (result) => {
			if (store.state.currentChatId === result.chatId) {
				currentChat.value.messages.unshift(result.message);
			}
		});
		await store.commit('setChatId', chat.id);
		const response = await store.dispatch('removeChatNotificationsByChatId', {
			count: notificationCount,
			chatId: chat.id,
		});
		emit('forceRerenderHeader');
	};

	const hideChat = async () => {
		users.value = ref(await store.dispatch('allFriends'));
		const mainChat = document.querySelector('.main-chat');

		mainChat.scrollTop = 0;
		message.value = '';
		chatIsOpen.value = false;
		currentChatFriend.value = {};
		await store.commit('removeChatId');
	};

	const sendMessage = async (chatId) => {
		// notify the backend to create a message
		await socket.emit(
			'create message',
			chatId,
			message.value,
			store.state.userId,
			currentChatFriend.value.id
		);

		message.value = '';
	};

	const sendMeetRequest = async (chatId) => {
		const response = await store.dispatch('changeAnonAgree', { chatId });
		currentChatUser.value.changeAnonAgree = response;
		alert('Meet request sent!');
	};

	onBeforeMount(async () => {
		users.value = ref(await store.dispatch('allFriends'));
	});

	onBeforeUnmount(() => {
		chatIsOpen.value = false;
	});
</script>

<style lang="scss" scoped>
	@import '../scss/variables';

	.chats {
		align-self: flex-start;
		width: 98vw;
		.users {
			display: flex;
			gap: 1em;
			flex-flow: row;
			justify-content: flex-start;
			overflow-x: auto;
			overflow-y: hidden;
			padding: 1em 0;
			width: 98vw;
			color: $dark;
		}
	}

	.chat {
		background: $gray;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		margin-top: 4em;
		transform: translateY(200px);
		opacity: 0;
		transition: 1s;
		height: 75vh;

		.send-message {
			display: flex;
			flex-flow: column;
			gap: 1em;
			padding: 1em 0;
			height: 20%;

			textarea {
				width: 90%;
				color: $white;
				background: $chat-gray;
				padding: 0.5em;
				border: 0px solid;
				border-radius: 10px;
			}

			.send-btn {
				font-size: 18px;
				color: $white;
				background: $background-gradient-green;
			}
		}

		.close {
			position: absolute;
			top: 0;
			right: 0;
			margin: 0.5em 0.5em 0 0;
			padding: 0.5em;
			color: $white;
			font-size: 1.5em;
			border-radius: 20px;
			background: $background-gradient-purple;
		}

		.meet-btn {
			position: absolute;
			top: 0;
			left: 0;
			font-size: 18px;
			margin: 0.5em 0 0 0.5em;
			color: $white;
			background: $background-gradient-purple;
		}

		.main-chat {
			display: flex;
			flex-flow: column-reverse;
			overflow-y: auto;
			justify-content: flex-start;
			overflow-x: hidden;
			background: $dark-gray;
			height: 80%;
			border-top-right-radius: 20px;
			border-top-left-radius: 20px;
			padding-bottom: 2em;
		}

		.message {
			padding-top: 1em;

			p {
				padding: 1em;
				width: 50%;
				border-radius: 20px;
			}
		}

		.user {
			padding-right: 1em;
			align-items: flex-end;

			p {
				color: white;
				background: blue;
			}
		}

		.friend {
			padding-left: 1em;
			align-items: flex-start;

			p {
				color: $white;
				background: $purple;
			}
		}
	}

	.open {
		transform: translateY(0px);
		opacity: 1;
		transition: 1s;
	}

	@media screen and (min-width: 750px) {
		.main-chat {
			width: 650px;
		}
	}
</style>
