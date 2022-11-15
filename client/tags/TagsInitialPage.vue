<template>
	<div class="tag-container">
		<div class="heading">
			<h3>Choose topics that you are interested!</h3>
			<h4>Please select at least 3 tags.</h4>
		</div>
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
							:class="selectedTags.includes(tag) ? 'selected' : ''"
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
							:class="selectedTags.includes(tag) ? 'selected' : ''"
						>
							{{ tag }}
						</h2>
					</div>
				</div>
			</div>
		</div>
		<button @click="setTags" class="btn accept-btn">Save</button>
	</div>
</template>

<script setup>
import { ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import store from '../store/index';

const router = useRouter();
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

const setTags = async () => {
	if (selectedTags.value.length < 3) {
		return alert('Please select at least 3 tags');
	}

	const result = await store.dispatch('setTags', { tags: selectedTags.value });
	router.push('/');
};
</script>

<style lang="scss" scoped>
@import '../scss/variables';
@import '../scss/globals';

.tag-container {
	color: $white;
	background: $background-gradient-purple;
	padding: 2em;
	border-radius: 25px;
	width: 80vw;
	margin: auto 0;

	.heading {
		gap: 0.3em;
		margin-bottom: 1.5em;

		h4 {
			color: $red;
		}
	}

	.tags {
		display: flex;
		flex-flow: row;

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

	.accept-btn {
		margin-top: 2em;
		font-size: 1.6em;

		&:hover {
			color: $purple;
			background: $gray;
		}
	}
}
@media screen and (min-width: 750px) {
	h3 {
		font-size: 18px;
	}

	h5 {
		font-size: 16px;
	}
}
</style>
