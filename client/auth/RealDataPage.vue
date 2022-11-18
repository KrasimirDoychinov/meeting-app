<template>
	<div class="real-data">
		<div class="real-data-heading">
			<h3>
				This data will <strong>ONLY </strong> be shown to users that you agree
				to show to.
			</h3>
		</div>
		<div class="real-data-form">
			<input
				type="text"
				class="input"
				placeholder="First Name"
				v-model="firstName"
			/>
			<input
				type="text"
				class="input"
				placeholder="Last Name"
				v-model="lastName"
			/>
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
			<p
				class="red-color"
				v-show="error"
			>
				{{ error }}
			</p>
		</div>
		<button
			@click="next()"
			class="btn accept-btn"
		>
			Next
		</button>
	</div>
</template>

<script setup>
	import { ref } from '@vue/reactivity';
	import store from '../store';
	import { useRouter } from 'vue-router';

	const router = useRouter();

	const allowedExt = ['png', 'jpeg', 'jpg'];
	// props
	const file = ref({});
	const error = ref('');
	const img = ref('');

	const firstName = ref('');
	const lastName = ref('');
	//methods
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

	const next = async () => {
		try {
			const reader = new FileReader();
			reader.readAsDataURL(file.value);
			reader.onload = async () => {
				const response = await store.dispatch('createRealData', {
					firstName: firstName.value,
					lastName: lastName.value,
					img: reader.result,
				});
				router.push('/tags/initial');
			};
		} catch (err) {
			error.value = err.response.data.msg;
		}
	};
</script>

<style lang="scss" scoped>
	@import '../scss/variables';
	@import '../scss/globals';

	.real-data {
		position: relative;
		display: grid;
		justify-items: center;
		grid-template-rows: 1fr 4fr 1fr;
		background: $background-gradient-purple;
		height: 70vh;
		width: 95vw;
		border-radius: 20px;

		&-heading {
			width: 80%;
			color: $white;
			padding-top: 1em;
		}

		&-form {
			display: flex;
			flex-flow: column;
			justify-content: start;
			gap: 1em;
			height: 100%;
			margin-top: 3em;

			.img-box {
				position: relative;
				background: $chat-gray;
				height: 300px;
				width: 80vw;

				img {
					height: 300px;
					width: 100%;
					object-fit: contain;
					z-index: 1;
				}
			}

			input[type='file'] {
				display: none;
			}
		}

		button {
			font-size: 18px;
			margin-bottom: 1em;
		}
	}
</style>
