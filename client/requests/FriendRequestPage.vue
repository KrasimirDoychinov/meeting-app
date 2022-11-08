<template>
	<div class="main-chat">
		<h2>Friend notifications</h2>
		<div class="users">
			<div
				v-for="(notification, index) in requests.notifications"
				:key="index"
				class="user-box"
			>
				<img src="../user (2).png" alt="" />
				{{ notification.name }}
				<button
					class="btn accept-btn"
					@click="acceptFriendRequest(notification.id)"
				>
					Accept
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onBeforeMount, ref } from '@vue/runtime-core';
import store from '../store/index';

const emit = defineEmits(['forceRerenderHeader']);

// props
const requests = ref([]);

// methods
const acceptFriendRequest = async (id) => {
	try {
		const response = await store.dispatch('acceptFriendRequest', { id });
		emit('forceRerenderHeader');
		requests.value.notifications = requests.value.notifications.filter(
			(x) => x.id !== id
		);
		alert('Friend request accepted!');
	} catch (error) {
		alert(`ERROR: ${error.response.data.msg}`);
	}
};

onBeforeMount(async () => {
	requests.value = await store.dispatch('friendRequestsByUser');
});
</script>

<style lang="scss" scoped>
@import '../scss/variables';
@import '../scss/globals';

.main-chat {
	align-self: flex-start;
	width: 98vw;
	h2 {
		margin: 0em 0em 1em 0em;
	}

	.users {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-flow: row;
		gap: 2em;
		color: $dark;
		overflow-y: hidden;
		overflow-x: auto;
		padding-bottom: 1em;

		.accept-btn {
			margin-top: 0.5em;
		}
	}
}

@media screen and (min-width: 750px) {
	.main-chat {
		width: 650px;
	}
}
</style>
