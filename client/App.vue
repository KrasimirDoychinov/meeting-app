<template>
	<router-view name="header"></router-view>
	<main>
		<div>
			<router-view></router-view>
		</div>
	</main>
	<footer></footer>
</template>

<script setup>
import { onMounted } from '@vue/runtime-core';
import { ref } from 'vue';
import store from './store/index';
</script>

<style lang="scss">
@import './scss/variables';

* {
	padding: 0;
	margin: 0;
}

html,
body {
	color: $dark;
	scroll-behavior: smooth;
}

a {
	color: $white;
	text-decoration: none;
}

ul {
	list-style: none;
}

body {
	display: flex;
	justify-content: center;
	align-items: center;
	background: $white;
	font-family: 'Cascadia Mono', sans-serif;
	font-size: 12px;
}

main {
	padding: 0.3em;
	height: 89vh;
	display: flex;
	justify-content: center;
	align-items: center;
	div {
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
	}
}

@media screen and (min-width: 750px) {
	main {
		div {
			width: 500px;
		}
	}
}
</style>
