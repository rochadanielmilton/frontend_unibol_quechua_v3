import { createApp } from 'vue'

import router from '@/router'
import store from './store'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';

import PrimeVue from 'primevue/config';

//manejo de estilos globales
import '@/assets/styles.scss';


createApp(App).use(store).use(PrimeVue).use(router).mount('#app')
