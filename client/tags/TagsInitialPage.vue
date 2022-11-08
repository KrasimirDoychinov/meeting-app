<template>
	<div class="tags">
		<div class="column">
			<div
				v-for="(tag, index) in tagsInitial.slice(0, tagsInitial.length / 2)"
				:key="index"
				class="tags-single"
			>
				<div>
					<h2
						@click="toggleTag(tag)"
						:class="selectedTags.includes(tag) ? 'test' : ''"
					>
						{{ tag }}
					</h2>
				</div>
			</div>
		</div>
		<div class="column">
			<div
				v-for="(tag, index) in tagsInitial.slice(tagsInitial.length / 2)"
				:key="index"
				class="tags-single"
			>
				<div>
					<h2
						@click="toggleTag(tag)"
						:class="selectedTags.includes(tag) ? 'test' : ''"
					>
						{{ tag }}
					</h2>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from '@vue/reactivity';

// props
const tagsInitial = ref([
	'History',
	'Football',
	'Cars',
	'Social',
	'Programming',
	'C',
	'C++',
	'JavaScript',
	'Python',
	'C#',
	'Node',
	'SQL',
	'Mongo',
	'GraphQL',
]);

const selectedTags = ref([]);

// methods
const toggleTag = (tag) => {
	if (!selectedTags.value.includes(tag)) {
		selectedTags.value.push(tag);
	} else {
		selectedTags.value = selectedTags.value.filter((x) => x !== tag);
	}
};
</script>

<style lang="scss" scoped>
@import '../scss/variables';

.test {
	color: $white !important;
	background: $background-pill-selected;
}

.tags {
	margin: auto 0;
	display: flex;
	flex-flow: row;
	border-radius: 25px;
	padding: 2em;
	background: $background-gradient-purple;
	width: 80vw;

	.column {
		gap: 1em;
		flex: 50%;

		h2 {
			color: $purple;
			padding: 0.5em 1em;
			border-radius: 200px;
			background: $background-pill-unselected;
		}
	}
}

@media screen and (min-width: 750px) {
	.tags {
		width: 650px;
	}
}
</style>
