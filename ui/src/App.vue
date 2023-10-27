<template>
    <ToastNotification />
    <div>
        <Navbar />

        <!-- Content Area -->
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
    import Navbar from "@/components/Navbar.vue";
    import ToastNotification from "@/components/ToastNotification.vue";
    import {Component, Vue} from "vue-facing-decorator";

    @Component({
        components: {ToastNotification, Navbar}
    })
    export default class App extends Vue {
        public mounted(): void {
            console.log(`Using ${import.meta.env.VITE_API_BASE_URL} as the base API url`);
        }
    }
</script>

<style>
/* You can include any additional styles or overrides here */
</style>
