<template>
	<div class="main-chat">
		<h2>Friend notifications</h2>
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

.main-chat {
	align-self: flex-start;
	width: 98vw;

	h2 {
		margin: 0em 0em 1em 0em;
	}

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
