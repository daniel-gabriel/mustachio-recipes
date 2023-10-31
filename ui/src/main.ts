import "bulma/css/bulma.css";
import "@oruga-ui/theme-bulma/dist/bulma.css";
import "./assets/main.css";

import {createApp} from "vue";
import {createPinia, type Pinia} from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import Oruga from "@oruga-ui/oruga-next";
import {bulmaConfig} from "@oruga-ui/theme-bulma";

import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import App from "./App.vue";
import {initRouter} from "@/router";
import {ApiService} from "@/api";
import {Config} from "@/Config";
import {AuthService} from "@/services/AuthService";
import {useAuthStore} from "@/stores/AuthStore";

// create the app
const app = createApp(App);

// set up font awesome
library.add(fas);
app.component("vue-fontawesome", FontAwesomeIcon);

// set up pinia
const pinia: Pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(pinia);

// set up Oruga
app.use(Oruga, {
    ...bulmaConfig,
    iconPack: "fas",
    iconComponent: "vue-fontawesome"
});

// create the Auth service
const authService = new AuthService({
    apiKey: Config.FIREBASE_API_KEY,
    authDomain: Config.FIREBASE_AUTH_DOMAIN,
    projectId: Config.FIREBASE_PROJECT_ID,
    storageBucket: Config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
    appId: Config.FIREBASE_APP_ID
});
app.provide("authService", authService);

// create the router
const router = initRouter(authService);
app.use(router);
app.provide("router", router);

// create the auth store
const authStore = useAuthStore();
authStore.initialize(authService, router);

// create the ApiService
const apiService = new ApiService({
    BASE: Config.API_BASE_URL,
    TOKEN: async (): Promise<string> => authStore.token || ""
});
app.provide("apiService", apiService);

app.mount("#app");
