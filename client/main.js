import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.provide('host', 'http://localhost:3000/api');
app.use(router).mount('#app');
