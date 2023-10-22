import {defineStore} from "pinia";

export const usePreferencesStore = defineStore("preferences", {
    state: (): IPreferences => {
        const osPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return {
            theme: osPrefersDark ? "dark" : "light"
        };
    },
    getters: {
        isDarkTheme: (state) => state.theme === "dark"
    },
    actions: {
        setTheme(theme: "dark" | "light") {
            this.theme = theme;
        }
    },
    persist: true
});

interface IPreferences {
    theme?: string;
}
