<template>
	<header>
		<h1>THIS IS THE HEADER FULL</h1>
	</header>
</template>

<style scoped lang="scss">
@import '../scss/_variables.scss';

header {
	padding: 0em 1em;
	display: flex;
	align-items: center;
	color: $white;
	height: 10vh;
	background: linear-gradient($purple, $light-purple);
	grid-area: header;
}
</style>
