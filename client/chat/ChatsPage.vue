<template>
	<div class="main-chat">
		<div v-show="!chatIsOpen" class="users">
			<div v-for="(user, index) in users.value" :key="index" class="user-box">
				<img @click="openChat" src="../user (2).png" alt="" />
				{{ user.name }}
			</div>
		</div>
		<div class="chat" :class="chatIsOpen ? 'open' : ''">
			<i @click="hideChat" class="close fa-solid fa-x"></i>
		</div>
	</div>
</template>

<script setup>
import { onBeforeMount, ref } from '@vue/runtime-core';
import store from '../store/index.js';

// props
const users = ref([]);
const chatIsOpen = ref(false);
// methods
const openChat = () => {
	chatIsOpen.value = true;
};

const hideChat = () => {
	chatIsOpen.value = false;
};
onBeforeMount(async () => {
	users.value = ref(await store.dispatch('allFriends'));
});
</script>

<style lang="scss" scoped>
@import '../scss/variables';

.main-chat {
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
	margin-top: 5em;
	height: 81vh;
	transform: translateY(200px);
	opacity: 0;
	transition: 1s;

	.close {
		position: absolute;
		top: 0;
		right: 0;
		padding: 1em 1em 0 0;
		color: $purple;
		font-size: 2em;
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
