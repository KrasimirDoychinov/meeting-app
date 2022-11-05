<template>
	<router-view name="header"></router-view>
	<main>
		<div>
			<router-view></router-view>
		</div>
	</main>
	<!-- <footer>
		<ul>
			<i class="insta fa-brands fa-instagram"></i>
		</ul>
	</footer> -->
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
		width: 100%;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
	}
}

footer {
	display: flex;
	align-items: center;
	padding: 0em 1em;
	height: 10vh;
	background: linear-gradient($light-purple, $purple);
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;

	ul {
		.insta {
			font-size: 5em;
			color: $white;
		}
	}
}

@media screen and (min-width: 750px) {
	main {
		div {
			width: 500px;
		}
	}

	footer {
		width: 750px;
	}
}
</style>
