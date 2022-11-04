<template>
	<header></header>
	<main>
		<router-view></router-view>
	</main>
	<footer></footer>
</template>

<script setup></script>

<style lang="scss">
@import './scss/variables';

* {
	padding: 0;
	margin: 0;
}

html,
body {
	color: $white;
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
	padding: 1em;
}

header {
	height: 10vh;
	grid-area: header;
}

main {
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
