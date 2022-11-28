<template>
	<div class="profile">
		<div class="profile-info">
			<img
				class="avatar-img"
				:src="user.imageUrl"
				alt=""
			/>
			{{ user.name }}
			<div class="tags">
				<div
					v-for="(tag, index) in user.tags"
					:key="index"
					class="tags-single"
				>
					<div>
						<h2>
							{{ tag }}
						</h2>
					</div>
				</div>
			</div>
		</div>
		<div class="profile-posts">
			<div class="posts">
				<div
					class="post"
					v-for="(post, index) in user.posts"
					:key="index"
				>
					<div class="creator">
						<img
							class="avatar-img"
							:src="post.creator.imageUrl"
							alt=""
						/>
						<h5>
							{{ post.creator.name }}
						</h5>
					</div>
					<div class="details">
						<h5 :class="!post.imageUrl ? 'margin' : ''">
							{{ post.description }}
						</h5>
						<img
							v-if="post.imageUrl"
							class="post-img"
							:src="post.imageUrl"
							alt=""
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onBeforeMount, ref } from '@vue/runtime-core';
	import { useRoute } from 'vue-router';
	import store from '../store/index.js';

	const route = useRoute();

	// props
	const user = ref({});
	onBeforeMount(async () => {
		const id = route.query.id;
		user.value = await store.dispatch('getUserById', { id });
		console.log(user.value);
	});
</script>

<style lang="scss" scoped>
	@import '../scss/globals';
	@import '../scss/variables';

	.profile {
		align-self: flex-start;
		justify-content: flex-start;
		height: 89vh;
		width: 98vw;
	}

	.tags {
		margin-top: 2em;
		padding-bottom: 1em;
	}

	.profile-posts {
	}

	.posts {
		margin-top: 2em;
		width: 90%;
		gap: 5em;
		padding-bottom: 1em;

		.post {
			border-radius: 2%;
			border: 1px solid $dark-gray;
			display: flex;
			gap: 1em;
			background: $gray;

			.creator {
				padding: 1em 0 0 2em;
				display: flex;
				flex-flow: row;
				gap: 1em;
				justify-content: start;

				h5 {
					font-size: 1em;
					color: black;
				}

				.avatar-img {
					width: 50px;
					height: 50px;
				}
			}

			.details {
				display: flex;
				align-items: flex-start;

				h5 {
					padding: 0.5em 0 0.5em 1em;
					font-size: 1.3em;
				}

				.margin {
					margin-bottom: 1em;
				}
				.post-img {
					position: relative;
					height: 45vh;
					width: 100%;
				}
			}
		}
	}
</style>
