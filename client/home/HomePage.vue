<template>
	<div class="home-container">
		<div
			@click="focusCreatePost(false)"
			v-if="users.length > 0"
			class="people-might-know"
		>
			<h2>People you might know!</h2>
			<div class="users">
				<div v-for="(user, index) in users" :key="index" class="user-box">
					<img class="avatar-img" :src="user.imageName" alt="" />
					{{ user.name }}

					<button
						v-if="!user.friendRequestSent"
						class="btn accept-btn"
						@click="addFriend(user.id)"
					>
						Send request
					</button>
					<button v-else class="btn disabled-btn">Pending</button>
				</div>
			</div>
		</div>
		<div class="create-post">
			<textarea
				@click="focusCreatePost(true)"
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
					<img :src="img" alt="" />
					<div class="img-picker" v-show="img"></div>
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
				<label for="file-upload" class="custom-file-upload">
					<i class="fa fa-cloud-upload"></i> Upload
				</label>
				<input id="file-upload" type="file" />
			</div>
		</div>
		<div @click="focusCreatePost(false)" class="test"></div>
	</div>
</template>

<script setup>
import { onBeforeMount, ref } from '@vue/runtime-core';
import store from '../store/index.js';

// props
const users = ref([]);
const postCreationFocus = ref(false);

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

// post creation
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

.test {
	height: 100%;
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
	}
}

@media screen and (min-width: 750px) {
	.people-might-know {
		width: 650px;
	}
}
</style>
