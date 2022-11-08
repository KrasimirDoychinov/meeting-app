<template>
	<router-view :key="headerKey" name="header"></router-view>
	<main>
		<router-view @forceRerenderHeader="forceRerenderHeader"></router-view>
	</main>
	<!-- <footer>
		<ul>
			<i class="insta fa-brands fa-instagram"></i>
		</ul>
	</footer> -->
</template>

// TODO: All alerts are placeholders for now
<script setup>
import { ref } from '@vue/reactivity';

const headerKey = ref(0);

const forceRerenderHeader = () => {
	headerKey.value++;
};
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
	padding-top: 11vh;
	height: 88vh;
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
		width: 650px;
	}

	footer {
		width: 750px;
	}
}
</style>
