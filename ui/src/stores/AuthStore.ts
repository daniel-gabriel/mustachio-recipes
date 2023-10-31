import {defineStore} from "pinia";
import type {AuthService} from "@/services/AuthService";
import {useStateStore} from "@/stores/StateStore";
import type {Router} from "vue-router";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isInitialized: false,
        token: undefined as string | undefined,
    }),
    getters: {
        isLoggedIn(state): boolean {
            return !!state.token;
        },
    },
    actions: {
        initialize(authService: AuthService, router: Router) {
            if (this.isInitialized) {
                return;
            }
            const stateStore = useStateStore();
            authService.initAuthStateListener(async (user) => {
                if (user) {
                    this.token = await user.getIdToken();
                    if (stateStore.nextUrl) {
                        console.log(`User just logged in. Sending to: ${stateStore.nextUrl}`);
                        const nextUrl = stateStore.nextUrl;
                        stateStore.setNextUrl(undefined);
                        await router.replace(nextUrl);
                    } else {
                        console.log(`User just logged in. No nextUrl`);
                    }
                } else {
                    this.resetToken();
                }
            });
            this.isInitialized = true;
        },
        resetToken() {
            this.token = undefined;
        }
    },
    persist: false
});
