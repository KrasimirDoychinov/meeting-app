<template>
	<div class="main-chat">
		<div class="users">
			<div
				v-for="(notification, index) in requests.notifications"
				:key="index"
				class="user-box"
			>
				{{ notification.id }}
				{{ notification.name }}
				<img
					@click="acceptFriendRequest(notification.id)"
					src="../user (2).png"
					alt=""
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onBeforeMount, ref } from '@vue/runtime-core';
import store from '../store/index';

// props
const requests = ref([]);

// methods
const acceptFriendRequest = async (id) => {
	const response = await store.dispatch('acceptFriendRequest', { id });
	console.log(response.data);
};

onBeforeMount(async () => {
	requests.value = await store.dispatch('friendRequestsByUser');
	console.log(requests.value);
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
