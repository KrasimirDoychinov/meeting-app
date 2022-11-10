<template>
	<div class="chats">
		<div v-show="!chatIsOpen" class="users">
			<div v-for="(user, index) in users.value" :key="index" class="user-box">
				<img
					@click="openChat(user.id, user.name)"
					src="../user (2).png"
					alt=""
				/>
				{{ user.name }}
			</div>
		</div>
		<div v-show="chatIsOpen" class="current-user">
			<img src="../user (2).png" alt="" />
			{{ currentChatFriend.name }}
		</div>
		<div class="chat" v-show="chatIsOpen" :class="chatIsOpen ? 'open' : ''">
			<i @click="hideChat" class="close fa-solid fa-x"></i>
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
				<button @click="sendMessage(currentChat.id)" class="btn send-btn">
					Send
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	onBeforeMount,
	onBeforeUnmount,
	onMounted,
	ref,
} from '@vue/runtime-core';
import store from '../store/index.js';

// props
const users = ref([]);
const chatIsOpen = ref(false);

const currentChat = ref({});
const currentChatFriend = ref({});
const userId = ref(store.state.userId);

const message = ref('');
// methods
const openChat = async (friendId, name) => {
	currentChatFriend.value = { id: friendId, name };
	const chat = await store.dispatch('chatById', { friendId });
	chat.messages = chat.messages.reverse();
	currentChat.value = chat;
	chatIsOpen.value = true;

	await socket.off('create message').on('create message', (msg) => {
		currentChat.value.messages.unshift(msg);
	});
};

const hideChat = () => {
	const mainChat = document.querySelector('.main-chat');
	mainChat.scrollTop = 0;
	chatIsOpen.value = false;
	currentChatFriend.value = {};
};

const sendMessage = async (chatId) => {
	await socket.emit(
		'create message',
		chatId,
		message.value,
		store.state.userId
	);

	message.value = '';
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
	height: 83vh;

	.send-message {
		display: flex;
		flex-flow: row;
		justify-content: space-around;
		align-items: center;
		height: 16%;

		textarea {
			width: 80%;
			height: 6em;
			color: $white;
			background: $chat-gray;
			padding: 0.5em;
			border: 0px solid;
			border-radius: 10px;
		}

		.send-btn {
			color: $white;
			background: $purple;
		}
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
		padding: 0.5em 0.5em 0 0;
		color: $purple;
		font-size: 2.5em;
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
