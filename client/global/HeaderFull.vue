<template>
	<div
		class="header"
		key="{{props.key}}"
	>
		<header>
			<router-link to="/">
				<i class="logo fa-brands fa-js"></i>
			</router-link>
			<ul>
				<li v-if="friendNotificationCount">
					<router-link to="/requests/friend">
						<i
							class="notifications fa-solid fa-envelope"
							:count="friendNotificationCount"
						></i>
					</router-link>
				</li>
				<li v-else>
					<i class="fa-solid fa-envelope"></i>
				</li>
				<li v-if="chatNotificationCount">
					<router-link to="/chat">
						<i
							:count="chatNotificationCount"
							class="notifications fa-solid fa-message"
						></i>
					</router-link>
				</li>
				<li v-else>
					<router-link to="/chat">
						<i class="fa-solid fa-message"></i>
					</router-link>
				</li>
				<li>
					<i
						@click="logout"
						class="fa-solid fa-right-from-bracket"
					></i>
				</li>
			</ul>
		</header>
	</div>
</template>

<script setup>
	import store from '../store/index';
	import { useRouter } from 'vue-router';
	import { onBeforeMount, ref } from '@vue/runtime-core';

	const router = useRouter();
	// props
	const props = defineProps({
		key: {
			type: Number,
		},
	});
	const friendNotificationCount = ref(0);
	const chatNotificationCount = ref(store.state.chatNotifications);

	onBeforeMount(async () => {
		const friendNCount = await store.dispatch('friendRequestsByUser');
		const chatNotifications = await store.dispatch('chatNotificationsByUser');
		friendNotificationCount.value = friendNCount.count;
		chatNotificationCount.value = chatNotifications;

		socket.off('chat notification').on('chat notification', (id, chatId) => {
			if (store.state.currentChatId !== chatId && id === store.state.userId) {
				socket.emit('create notification', id, chatId);
			}
		});

		socket.off('create notification').on('create notification', async (result) => {
			if (store.state.userId === result.userId) {
				chatNotificationCount.value = result.count;
				await store.commit('setChatNotifications', result.count);
			}
		});

		socket.off('receive friend request').on('receive friend request', (id) => {
			if (store.state.userId === id) {
				friendNotificationCount.value += 1;
			}
		});
	});

	// methods
	const logout = async () => {
		await store.commit('removeToken');
		await store.commit('removeTags');
		router.push('/login');
	};
</script>

<style scoped lang="scss">
	@import '../scss/_variables.scss';
	@import '../scss/_globals.scss';

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	header {
		z-index: 100;

		position: fixed;
		top: 0;
		font-size: 1.6em;
		padding: 0em 1em;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 93vw;
		color: $white;
		height: 10vh;
		background: linear-gradient($purple, $light-purple);
		grid-area: header;
		border-bottom-left-radius: 20px;
		border-bottom-right-radius: 20px;

		.logo {
			font-size: 2em;
		}

		.notifications {
			position: relative;
			&::after {
				font-size: 0.6em;
				margin-left: 1em;
				margin-top: 1em;
			}
		}

		ul {
			font-size: 1em;
			display: flex;
			gap: 0.8em;
			.messages {
				color: $white;
				width: 1em;
				height: 1em;
			}
		}
	}

	@media screen and (min-width: 750px) {
		header {
			width: 750px;
		}
	}
</style>
