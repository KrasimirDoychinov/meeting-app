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
// methods
const openChat = async (friendId) => {
	currentChat.value = await store.dispatch('chatById', { friendId });
	console.log(currentChat.value);
	chatIsOpen.value = true;
};

const hideChat = () => {
	chatIsOpen.value = false;
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
	display: flex;
	flex-flow: column;
	background: $gray;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	margin-top: 5em;
	height: 83vh;
	transform: translateY(200px);
	opacity: 0;
	transition: 1s;

	textarea {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 2em;
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
		align-self: flex-end;
		justify-content: flex-start;
		background: $dark-gray;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 3em;
		border-top-right-radius: 20px;
		border-top-left-radius: 20px;
	}

	.message {
		padding-top: 1em;
		justify-content: flex-start;
		color: $purple;

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
