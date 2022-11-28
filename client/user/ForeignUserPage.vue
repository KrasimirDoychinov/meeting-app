<template>
	<div class="profile">
		<div class="profile-info"></div>
		<div class="profile-posts"></div>
	</div>
</template>

<script setup>
	import { onBeforeMount, ref } from '@vue/runtime-core';
	import { useRoute } from 'vue-router';
	import store from '../store/index.js';

	const route = useRoute();

	onBeforeMount(async () => {
		const id = route.query.id;
		console.log(await store.dispatch('getUserById', { id }));
	});
</script>

<style lang="scss" scoped>
	@import '../scss/globals';
	@import '../scss/variables';
</style>
