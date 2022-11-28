<template>
	<div class="home-container">
		<div
			@click="focusCreatePost(false)"
			v-if="users.length > 0"
			class="people-might-know"
		>
			<h2>People you might know!</h2>
			<div class="users">
				<div
					v-for="(user, index) in users"
					:key="index"
					class="user-box"
				>
					<img
						class="avatar-img"
						:src="user.imageUrl"
						alt=""
					/>
					{{ user.name }}

					<button
						v-if="!user.friendRequestSent"
						class="btn accept-btn"
						@click="addFriend(user.id)"
					>
						Send request
					</button>
					<button
						v-else
						class="btn disabled-btn"
					>
						Pending
					</button>
				</div>
			</div>
		</div>
		<div class="create-post">
			<textarea
				@click="focusCreatePost(true)"
				v-model="description"
				class="input"
				type="text"
				placeholder="Today I'm feeling..."
			></textarea>
			<div
				v-show="postCreationFocus"
				:class="postCreationFocus ? 'open-input' : ''"
				class="post-preview"
			>
				<div class="img-box">
					<img
						:src="img"
						alt=""
					/>
					<div
						class="img-picker"
						v-show="img"
					></div>
				</div>
				<div class="tags">
					<div
						v-for="(tag, index) in userTags"
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
				<div class="post-creation-btns">
					<label
						for="file-upload"
						class="custom-file-upload"
					>
						<i class="fa fa-cloud-upload"></i> Upload
					</label>
					<input
						id="file-upload"
						type="file"
						@change="onFileChange"
					/>
					<button
						@click="createPost"
						class="btn accept-btn"
					>
						Post!
					</button>
				</div>
				<p
					class="red-color"
					v-show="error"
				>
					{{ error }}
				</p>
			</div>
		</div>
		<div
			@click="focusCreatePost(false)"
			class="posts"
		>
			<div
				class="post"
				v-for="(post, index) in posts"
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
				<div class="comment-section">
					<button
						class="btn show-btn"
						@click="toggleComments(post)"
					>
						{{ post.showComments ? 'Hide' : 'Show' }}
					</button>
					<div
						class="comments"
						v-if="post.showComments"
					>
						<div
							v-for="(comment, index) in post.comments"
							:key="index"
							class="comment"
						>
							<p>
								<router-link
									:to="{ name: 'Foreign Account', query: { id: comment.creator.id } }"
									><span>{{ comment.creator.name }}</span></router-link
								>
								{{ comment.content }}
							</p>
						</div>
					</div>
					<div class="create-comment">
						<textarea
							type="text"
							placeholder="Comment..."
							v-model="post.commentContent"
							class="input"
							:class="`comment${post.id}`"
						></textarea>
						<button
							@click="createComment(post)"
							class="btn accept-btn"
						>
							Post
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onBeforeMount, ref } from '@vue/runtime-core';
	import store from '../store/index.js';

	const allowedExt = ['png', 'jpeg', 'jpg'];
	// props
	const error = ref('');
	const img = ref('');
	const description = ref('');
	const file = ref({});
	const users = ref([]);
	const postCreationFocus = ref(false);

	const posts = ref([]);

	const userTags = ref(store.state.tags);
	const selectedTags = ref([]);

	// methods
	const addFriend = async (id) => {
		try {
			await store.dispatch('addFriend', { id });
			users.value = users.value.filter((x) => x.id !== id);
			alert('Friend request sent!');
		} catch (error) {
			alert(`ERROR: ${error.response.data.msg}`);
		}
	};

	const onFileChange = async (event) => {
		const reader = new FileReader();
		const currentFileName = event.target.files[0].name;
		const currentFileExt = currentFileName.split('.').reverse()[0];
		if (!allowedExt.includes(currentFileExt)) {
			error.value = 'The file extension can only be .png, .jpeg, .jpg.';
			img.value = '';
			return;
		}
		error.value = '';
		reader.readAsDataURL(event.target.files[0]);
		reader.onload = async () => {
			img.value = reader.result;
			file.value = event.target.files[0];
		};
	};

	const createPost = async () => {
		try {
			if (!img.value || !description.value || selectedTags.value.length === 0) {
				alert('All fields are required');
				throw new Error('All fields are required');
			}
			let response;
			const reader = new FileReader();
			reader.readAsDataURL(file.value);
			reader.onload = async () => {
				response = await store.dispatch('createPost', {
					tags: selectedTags.value,
					description: description.value,
					img: reader.result,
				});
			};
		} catch (err) {
			error.value = err;
		}
	};

	const createComment = async (post) => {
		if (!post.id || !post.commentContent) {
			alert('Cannot comment nothing');
		} else {
			const response = await store.dispatch('createComment', {
				id: post.id,
				content: post.commentContent,
			});
			post.comments.push(response);
		}
		post.commentContent = '';
	};

	const toggleComments = async (post) => {
		post.showComments = post.showComments ? false : true;
	};

	const focusCreatePost = (value) => {
		postCreationFocus.value = value;
	};

	const toggleTag = (tag) => {
		if (!selectedTags.value.includes(tag)) {
			selectedTags.value.push(tag);
		} else {
			selectedTags.value = selectedTags.value.filter((x) => x !== tag);
		}
	};

	onBeforeMount(async () => {
		users.value = await store.dispatch('allUsersByTag', {
			tags: store.state.tags,
		});

		posts.value = await store.dispatch('allPostsWithTags', { tags: store.state.tags });
		posts.value.forEach((x) => {
			x.showComments = false;
			x.commentContent = '';
		});
	});
</script>

<style scoped lang="scss">
	@import '../scss/variables';
	@import '../scss/globals';

	.home-container {
		align-self: flex-start;
		display: flex;
		justify-content: flex-start;
		height: 89vh;
		width: 98vw;
	}

	h2 {
		margin: 0.2em 0em 0.5em;
	}

	.people-might-know {
		border-bottom: 2px solid $purple;
		padding-bottom: 1em;
		margin-bottom: 1em;

		.users {
			display: flex;
			flex-flow: row;
			overflow-y: hidden;
			overflow-x: auto;
			justify-content: flex-start;
			gap: 1em;

			.accept-btn {
				margin-top: 0.5em;
			}
		}
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

	.comment-section {
		padding-bottom: 0.5em;

		.show-btn {
			background: $background-gradient-purple;
			color: $white;
		}

		.comments {
			border-top: 1px solid $border-gray;
			height: 20vh;
			overflow-x: hidden;
			justify-content: start;
			padding-top: 0.5em;
			display: flex;
			gap: 0.5em;
			margin: 1em 0 1em 0;

			.comment {
				padding-left: 0.5em;
				display: flex;
				flex-flow: row;
				justify-content: flex-start;
				margin-bottom: 0.1em;

				p {
					width: 96%;
					word-break: break-all;

					span {
						margin-right: 1em;
						font-weight: bold;
						color: black;
					}
				}
			}
		}

		.create-comment {
			border-top: 1px solid $border-gray;
			padding-top: 0.5em;
			display: flex;
			flex-flow: row;
			justify-content: space-around;

			.input {
				height: 3em;
				width: 60%;
			}
		}
	}

	.open-input {
		height: 100%;
	}

	.create-post {
		display: flex;
		justify-content: start;
		gap: 1em;

		.input {
			border: 1px solid $purple;
			height: 5em;
			padding-top: 0.5em;
		}

		.tags {
			display: flex;
			flex-flow: row;
			overflow-y: hidden;
			overflow-x: auto;
			justify-content: flex-start;
			gap: 1em;

			h2 {
				color: $purple;
				padding: 0.5em 1em;
				border-radius: 200px;
				background: $background-pill-unselected;
			}
		}

		.post-preview {
			display: flex;
			gap: 1em;

			.img-box {
				position: relative;
				height: 300px;
				width: 80vw;

				img {
					height: 300px;
					width: 100%;
					object-fit: contain;
					z-index: 1;
				}
			}

			.post-creation-btns {
				display: flex;
				flex-flow: row;
				justify-content: space-around;
			}
		}
	}

	@media screen and (min-width: 750px) {
		.people-might-know {
			width: 650px;
		}
	}
</style>
