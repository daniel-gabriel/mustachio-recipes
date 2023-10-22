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
    import { defineComponent } from 'vue';
    import Navbar from "@/components/Navbar.vue";
    import ToastNotification from "@/components/ToastNotification.vue";

    export default defineComponent({
        name: 'App',
        components: {ToastNotification, Navbar},
    });
</script>

<style>
/* You can include any additional styles or overrides here */
</style>
