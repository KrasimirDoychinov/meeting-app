<template>
	<router-view name="header"></router-view>
	<main>
		<router-view></router-view>
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
	display: grid;
	grid-template-areas:
		'header'
		'main  '
		'footer';
	background: $white;
	font-family: 'Cascadia Mono', sans-serif;
	font-size: 12px;
}

main {
	padding: 0.3em;
	height: 78vh;
	display: flex;
	justify-content: center;
	align-items: center;
	grid-area: main;
}

footer {
	height: 10vh;
}
</style>
