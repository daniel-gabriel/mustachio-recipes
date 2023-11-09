import {defineStore} from "pinia";
import type {AuthService} from "@/services/AuthService";
import {useStateStore} from "@/stores/StateStore";
import type {Router} from "vue-router";

export const useAuthStore = defineStore("auth", {
    state: (): IAuthState => ({
        isInitialized: false,
        token: undefined as string | undefined,
        sub: undefined as string | undefined
    }),
    getters: {
        isLoggedIn(state): boolean {
            return !!state.token;
        },
        getSubId(state): string | undefined {
            return state.sub;
        }
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
                    this.sub = user.uid;
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


export interface IAuthState {
    isInitialized: boolean,
    token?: string,
    sub?: string
}
