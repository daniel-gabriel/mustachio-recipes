<template>
    <ToastNotification />
    <div>
        <Navbar />

        <!-- Content Area -->
        <div class="container">
            <router-view></router-view>
        </div>

        <Footer/>
    </div>
</template>

<script lang="ts">
    import Navbar from "@/components/Navbar.vue";
    import ToastNotification from "@/components/ToastNotification.vue";
    import {Component, Vue} from "vue-facing-decorator";
    import Footer from "@/components/Footer.vue";

    @Component({
        components: {ToastNotification, Navbar, Footer}
    })
    export default class App extends Vue {}
</script>

<style>
/* You can include any additional styles or overrides here */
</style>
