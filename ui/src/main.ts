import 'bulma/css/bulma.css';
import '@oruga-ui/theme-bulma/dist/bulma.css';
import './assets/main.css'

import { createApp } from 'vue'
import {createPinia, type Pinia} from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import Oruga from '@oruga-ui/oruga-next';
import {bulmaConfig} from '@oruga-ui/theme-bulma';

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import App from './App.vue'
import router from './router'

library.add(fas);

const app = createApp(App)

app.component("vue-fontawesome", FontAwesomeIcon);

const pinia: Pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia)

app.use(router)
app.use(Oruga, {
    ...bulmaConfig,
    iconPack: "fas",
    iconComponent: "vue-fontawesome"
});

app.mount('#app')
