<template>
    <div v-if="!loggedIn" class="hero">
        <section class="card">
            <div class="card-header">
                <div class="card-title">Login</div>
            </div>
            <div class="card-content">
                <o-field grouped class="centered-field">
                    <o-button variant="info" @click="signIn('email')">Log in with Email</o-button>
                    <o-button variant="info" @click="signIn('google')">Log in with Google</o-button>
                </o-field>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
    import {Component, Inject, Vue} from "vue-facing-decorator";
    import type {AuthService} from "@/services/AuthService";
    import {useAuthStore} from "@/stores/AuthStore";

    @Component
    export default class LoginView extends Vue {
        private readonly authStore = useAuthStore();

        public get loggedIn() {
            return this.authStore.isLoggedIn;
        }

        @Inject()
        public authService!: AuthService;

        public async signIn(provider: "google" | "email") {
            await this.authService.signIn(provider);
        }
    }
</script>

<style scoped>
</style>