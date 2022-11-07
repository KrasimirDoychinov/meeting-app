<template>
	<div class="main-chat">
		<div class="users">
			<div
				v-for="(user, index) in requests.value"
				:key="index"
				class="user-box"
			>
				{{ user.name }}
				{{ user.id }}
				<img @click="addFriend(user.id)" src="../user (2).png" alt="" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { onBeforeMount, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';

const store = useStore();

// props
const requests = ref([]);

onBeforeMount(async () => {
	requests.value = await store.dispatch('allFriendRequests');
});
</script>

<style lang="scss" scoped>
@import '../scss/variables';
</style>
