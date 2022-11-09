<template>
	<div class="chats">
		<div v-show="!chatIsOpen" class="users">
			<div v-for="(user, index) in users.value" :key="index" class="user-box">
				<img @click="openChat(user.id)" src="../user (2).png" alt="" />
				{{ user.name }}
			</div>
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
import { onBeforeMount, onBeforeUnmount, ref } from '@vue/runtime-core';
import store from '../store/index.js';

// props
const users = ref([]);
const chatIsOpen = ref(false);

const currentChat = ref({});
const userId = ref(store.state.userId);

const message = ref('');
// methods
const openChat = async (friendId) => {
	const chat = await store.dispatch('chatById', { friendId });
	chat.messages = chat.messages.reverse();
	currentChat.value = chat;
	chatIsOpen.value = true;
	const mainChat = document.querySelector('.main-chat');
};

const hideChat = () => {
	chatIsOpen.value = false;
};

const sendMessage = async (chatId) => {
	console.log(message.value);
	const response = await store.dispatch('sendMessage', {
		chatId,
		content: message.value,
	});
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
		flex-flow: row;
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
