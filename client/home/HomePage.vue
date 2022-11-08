<template>
	<div class="home-container">
		<div class="people-might-know">
			<h2>People you might know!</h2>
			<div class="users">
				<div v-for="(user, index) in users.value" :key="index" class="user-box">
					<img src="../user (2).png" alt="" />
					{{ user.name }}
					<button class="accept-btn" @click="addFriend(user.id)">Friend</button>
				</div>
				<div v-for="(user, index) in users.value" :key="index" class="user-box">
					<img src="../user (2).png" alt="" />
					{{ user.name }}
					<button class="accept-btn" @click="addFriend(user.id)">Friend</button>
				</div>
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
	users.value = ref(await store.dispatch('allUsers'));
});
</script>

<style scoped lang="scss">
@import '../scss/variables';

.home-container {
	align-self: flex-start;
	display: flex;
	justify-content: flex-start;
	height: 89vh;
	width: 98vw;
}

h2 {
	margin: 0.2em 0em 1em;
}

.people-might-know {
	border-bottom: 2px solid $purple;
	padding-bottom: 1em;

	.users {
		display: flex;
		flex-flow: row;
		overflow-y: hidden;
		overflow-x: auto;
		justify-content: flex-start;
		padding-bottom: 1em;
		gap: 1em;

		.user-box {
			gap: 1em;
		}

		.accept-btn {
			margin-top: 0.5em;
		}
	}
}
@media screen and (min-width: 750px) {
	.people-might-know {
		width: 650px;
	}
}
</style>
