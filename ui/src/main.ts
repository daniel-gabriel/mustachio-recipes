import "bulma/css/bulma.css";
import "@oruga-ui/theme-bulma/dist/bulma.css";
import "./assets/main.css"

import { createApp } from "vue"
import {createPinia, type Pinia} from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import Oruga from "@oruga-ui/oruga-next";
import {bulmaConfig} from "@oruga-ui/theme-bulma";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import App from "./App.vue"
import router from "./router"
import {ApiService} from "@/api";

library.add(fas);

const app = createApp(App);

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
console.log(`Using ${import.meta.env.VITE_API_BASE_URL} as the base API url`);
const apiService = new ApiService({
    BASE: import.meta.env.VITE_API_BASE_URL
    // TOKEN: async (): Promise<string> => ""
});
app.provide("apiService", apiService);

app.mount("#app")
