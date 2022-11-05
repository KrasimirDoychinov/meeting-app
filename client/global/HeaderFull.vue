<template>
	<div class="header">
		<header>
			<a @click="logout">Logout</a>
		</header>
	</div>
</template>

<script setup>
import store from '../store/index';
import router from '../router';

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
	padding: 0em 1em;
	display: flex;
	align-items: flex-start;
	align-items: center;
	width: 100%;
	color: $white;
	height: 10vh;
	background: linear-gradient($purple, $light-purple);
	grid-area: header;
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 20px;
}

@media screen and (min-width: 750px) {
	header {
		width: 750px;
	}
}
</style>
