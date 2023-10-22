<template>
    <o-switch
        v-if="supportsWakeLock"
        v-model="isScreenLockOn"
        variant="warning"
        position="left"
    >
        {{currentLabel}}
    </o-switch>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-facing-decorator";
    import {useAlertStore} from "@/stores/AlertStore";
    import {nameof} from "@/utils/Helpers";

    @Component
    export default class KeepScreenOnSwitcher extends Vue {
        public isScreenLockOn = false;
        @Watch(nameof<KeepScreenOnSwitcher>("isScreenLockOn"))
        public async onScreenLockOn(value: boolean) {
            if (value) {
                await this.acquireWakeLock();
            } else {
                await this.releaseWakeLock();
            }
        }

        public get supportsWakeLock() {
            return "wakeLock" in navigator;
        }
        public get currentLabel() {
            return this.isScreenLockOn ? "I'm cooking, screen will stay on" : "Keep the screen on while I cook";
        }

        private readonly alertStore = useAlertStore();
        private wakeLock: WakeLockSentinel | null = null;

        private async acquireWakeLock() {
            // check if a wakelock already exists and return if yes.
            if (this.wakeLock) {
                return;
            }
            try {
                this.wakeLock = await navigator.wakeLock.request("screen");
                this.wakeLock.addEventListener("release", () => {
                    this.isScreenLockOn = false;
                });
            } catch (err) {
                this.isScreenLockOn = false;
                this.alertStore.error("Could not enable Keep Screen On feature, looks like your browser doesn't support it");
            }
        }

        private async releaseWakeLock() {
            // if there is no wake lock, return.
            if (!this.wakeLock) {
                return;
            }
            try {
                await this.wakeLock.release();
                this.isScreenLockOn = false;
            } catch (err) {
                this.alertStore
                    .error("Could not turn off the Keep Screen On feature. Please navigate away from this page to turn turn off the screen lock and prevent battery drain.");
            }
        }
    }
</script>

<style scoped>
</style>
