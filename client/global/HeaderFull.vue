<template>
	<div class="header">
		<header>
			<i class="logo fa-brands fa-js"></i>
			<div class="search">
				<i class="fa-solid fa-magnifying-glass"></i>
				<input type="text" v-model="search" placeholder="Search" />
			</div>
			<ul>
				<li>
					<router-link to="/chat">
						<i class="fa-solid fa-message"></i>
					</router-link>
				</li>
				<li>
					<i @click="logout" class="fa-solid fa-right-from-bracket"></i>
				</li>
			</ul>
		</header>
	</div>
</template>

<script setup>
import store from '../store/index';
import { useRouter } from 'vue-router';

const router = useRouter();

// methods
const logout = async () => {
	store.commit('removeToken');
	router.push('/login');
};
</script>

<style scoped lang="scss">
@import '../scss/_variables.scss';

.header {
	display: flex;
	justify-content: center;
	align-items: center;
}

header {
	position: fixed;
	top: 0;
	font-size: 18px;
	padding: 0em 1em;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 95vw;
	color: $white;
	height: 10vh;
	background: linear-gradient($purple, $light-purple);
	grid-area: header;
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 20px;

	.logo {
		font-size: 2em;
	}

	.search {
		display: flex;
		gap: 0.5em;

		input {
			padding-left: 1em;
			height: 1.5em;
			border-radius: 10px;
			border: 0px solid;
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
