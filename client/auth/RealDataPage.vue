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
				<img :src="img" alt="" />
				<div class="img-picker" v-show="img"></div>
			</div>
			<label for="file-upload" class="custom-file-upload">
				<i class="fa fa-cloud-upload"></i> Upload
			</label>
			<input id="file-upload" type="file" @change="onFileChange" />
			<p class="red-color" v-show="error">{{ error }}</p>
		</div>
		<button @click="next()" class="btn accept-btn">Next</button>
	</div>
</template>

<script setup>
import { ref } from '@vue/reactivity';

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
	reader.onload = () => {
		img.value = reader.result;
	};
};

const next = async () => {
  try {
    
  } catch (error) {
    
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
	grid-template-rows: 1fr 4fr;
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
			height: 50%;
			width: 80vw;

			img {
				height: 100%;
				width: 100%;
				object-fit: contain;
				z-index: 1;
			}

			.img-picker {
				border-radius: 100%;
				background: rgb(255, 255, 255);
				opacity: 0.5;
				position: absolute;
				height: 20em;
				width: 20em;
				border-radius: 100%;
				z-index: 3;
			}
		}

		input[type='file'] {
			display: none;
		}

		.custom-file-upload {
			border-radius: 20px;
			background: $background-gradient-green;
			color: $white;
			padding: 0.5em 1em;
			font-size: 1.5em;
			cursor: pointer;
		}
	}

	button {
		position: absolute;
		bottom: 0;
		font-size: 18px;
		margin-bottom: 1em;
	}
}
</style>
