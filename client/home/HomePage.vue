<template>
	<h1>This is the homepage and I'm logged in</h1>
	<router-link to="/login">Login</router-link>
	<router-link to="/register">Register</router-link>
</template>

<script setup></script>

<style scoped lang="scss">
@import '../scss/variables';

.main-render {
	display: flex;
	flex-flow: column;
	justify-content: center;
}
</style>
