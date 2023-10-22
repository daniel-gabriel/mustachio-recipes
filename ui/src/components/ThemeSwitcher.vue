<template>
    <div class="theme-switch-wrapper">
        <img alt="light theme" width="20" class="circle-icon" src="@/assets/theme-light.svg" />
        <label class="theme-switch" for="checkbox">
            <input
                type="checkbox"
                id="checkbox"
                @change="(e) => handleDarkModeChecked(e)"
                :checked="isDarkMode"
            />
            <span class="slider round"></span>
        </label>
        <img alt="dark theme" width="20" class="circle-icon" src="@/assets/theme-dark.svg" />
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-facing-decorator";
    import {usePreferencesStore} from "@/stores/PreferencesStore";

    @Component
    export default class ThemeSwitcher extends Vue {
        private readonly preferencesStore = usePreferencesStore();
        public isDarkMode = this.preferencesStore.isDarkTheme;

        public mounted(): void {
            console.log(`dark mode: ${this.isDarkMode}`);
            if (this.isDarkMode) {
                this.setDocumentTheme("dark");
            }
        }
        public handleDarkModeChecked(event: Event): void {
            const isCheckboxChecked = (event.target as HTMLInputElement)?.checked;
            if (isCheckboxChecked === undefined) {
                return;
            }
            this.isDarkMode = isCheckboxChecked;
            const theme = this.isDarkMode ? "dark" : "light";
            this.setDocumentTheme(theme);
            console.log(`calling setTheme on ${this.preferencesStore ? "not null" : "null"}`);
            this.preferencesStore.setTheme(theme);
        }

        private setDocumentTheme(theme: string): void {
            document.documentElement.setAttribute("data-theme", theme);
        }
    }
</script>

<style scoped>
    .theme-switch-wrapper {
        display: flex;
        align-items: center;
    }
    .theme-switch {
        display: inline-block;
        height: 34px;
        position: relative;
        width: 60px;
        margin-left: 4px;
        margin-right: 4px;
    }
    .theme-switch input {
        display: none;
    }
    .slider {
        background-color: #ccc;
        bottom: 0;
        cursor: pointer;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: 0.4s;
    }
    .slider:before {
        background-color: #fff;
        bottom: 4px;
        content: "";
        height: 26px;
        left: 4px;
        position: absolute;
        transition: 0.4s;
        width: 26px;
    }
    input:checked + .slider {
        background-color: var(--color-heading);
    }
    input:checked + .slider:before {
        transform: translateX(26px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
    .circle-icon {
        background: #ffffff;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        text-align: center;
        line-height: 24px;
        vertical-align: middle;
        padding: 2px;
    }
</style>
