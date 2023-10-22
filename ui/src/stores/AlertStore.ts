import {defineStore} from "pinia";

export const useAlertStore = defineStore("alert", {
    state: (): IAlertState => ({
        alert: null
    }),
    getters: {
        hasAlert: (state) => !!state.alert
    },
    actions: {
        success(message: string) {
            this.alert = {message, type: "success"};
        },
        error(message: string) {
            this.alert = {message, type: "error"};
        },
        clear() {
            this.alert = null;
        }
    }
});

export interface IAlertState {
    alert: null | {
        message: string;
        type: "success" | "error";
    };
}
