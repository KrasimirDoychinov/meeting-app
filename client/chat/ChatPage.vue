<template>
	<div class="main-chat">
		<div class="users">
			<div v-for="(user, index) in users.value" :key="index" class="user-box">
				<img @click="addFriend(user.id)" src="../user (2).png" alt="" />
				{{ user.name }}
			</div>
		</div>
	</div>
</template>

<script setup>
import { onBeforeMount, ref } from '@vue/runtime-core';
import store from '../store/index.js';

// props
const users = ref([]);

// methods
const addFriend = async (id) => {
	try {
		await store.dispatch('addFriend', { id });
		alert('Friend request sent!');
	} catch (error) {
		alert(`ERROR: ${error.response.data.msg}`);
	}
};

onBeforeMount(async () => {
	users.value = ref(await store.dispatch('allFriends'));
	console.log(users.value);
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

@media screen and (min-width: 750px) {
	.main-chat {
		width: 650px;
	}
}
</style>
