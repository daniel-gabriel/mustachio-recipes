<template>
    <div v-show="alertStore.hasAlert" id="snackbar" class="notification is-pulled-right" :class="alertClass">
        <button class="delete" @click="close()"></button>
        <div v-html="alertStore.alert?.message || ''"></div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-facing-decorator";
    import {useAlertStore} from "@/stores/AlertStore";

    @Component
    export default class ToastNotification extends Vue {
        public readonly alertStore = useAlertStore();

        public get alertClass(): string {
            switch (this.alertStore.alert?.type) {
                case "success":
                    return "is-success";
                case "error":
                    return "is-danger";
                default:
                    return "is-info";
            }
        }

        public close(): void {
            this.alertStore.clear();
        }
    }
</script>

<style scoped>
    #snackbar {
        min-width: 250px; /* Set a default minimum width */
        margin-left: -125px; /* Divide value of min-width by 2 */
        text-align: center; /* Centered text */
        position: fixed; /* Sit on top of the screen */
        z-index: 1; /* Add a z-index if needed */
        left: 50%; /* Center the snackbar */
        bottom: 30px; /* 30px from the bottom */
    }

    /* Animations to fade the snackbar in and out */
    @-webkit-keyframes fadein {
        from {
            bottom: 0;
            opacity: 0;
        }
        to {
            bottom: 30px;
            opacity: 1;
        }
    }

    @keyframes fadein {
        from {
            bottom: 0;
            opacity: 0;
        }
        to {
            bottom: 30px;
            opacity: 1;
        }
    }

    @-webkit-keyframes fadeout {
        from {
            bottom: 30px;
            opacity: 1;
        }
        to {
            bottom: 0;
            opacity: 0;
        }
    }

    @keyframes fadeout {
        from {
            bottom: 30px;
            opacity: 1;
        }
        to {
            bottom: 0;
            opacity: 0;
        }
    }
</style>
