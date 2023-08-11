import './bootstrap';
import {createApp} from 'vue';
import Index from "./components/Index.vue";

const app = createApp({});

app.component('Index', Index);

app.mount('#app');


