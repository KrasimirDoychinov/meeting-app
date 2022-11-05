<template>
	<div class="main-chat">
		<div class="users">
			<div v-for="(user, index) in users.value" :key="index" class="user-box">
				{{ user.name }}
				{{ user.id }}
				<img @click="addFriend(user.id)" src="../user (2).png" alt="" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from '@vue/runtime-core';
import store from '../store/index.js';

// props
const users = ref([]);

// methods
const addFriend = async (id) => {
	store.dispatch('addFriend', { id });
	alert('Friend request sent!');
};

onBeforeMount(async () => {
	users.value = ref(await store.dispatch('allUsers'));
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
