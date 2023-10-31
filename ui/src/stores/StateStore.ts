import {defineStore} from "pinia";

export const useStateStore = defineStore("state", {
    state: (): IState => ({
        targetUrl: undefined
    }),
    getters: {
        nextUrl: (state) => state.targetUrl
    },
    actions: {
        setNextUrl(nextUrl?: string) {
            this.targetUrl = nextUrl;
        }
    },
    persist: true
});

interface IState {
    targetUrl?: string;
}
