<template>
    <div v-if="!loggedIn" class="hero">
        <section class="hero-body">
            <div class="columns is-vcentered">
                <div class="column has-vertical-separator is-hidden-mobile">
                    <img src="@/assets/big-chef.png" alt="Picture of a chef" style="height: 350px; width: auto;"/>
                </div>
                <div class="column is-flex is-justify-content-center is-align-items-center">
                    <google-sign-in-button @clicked="signIn('google')"/>
                </div>
            </div>
        </section>

    </div>
</template>

<script lang="ts">
    import {Component, Inject, Vue} from "vue-facing-decorator";
    import type {AuthService} from "@/services/AuthService";
    import {useAuthStore} from "@/stores/AuthStore";
    import GoogleSignInButton from "@/components/GoogleSignInButton.vue";

    @Component({
        components: {GoogleSignInButton}
    })
    export default class LoginView extends Vue {
        private readonly authStore = useAuthStore();

        public get loggedIn() {
            return this.authStore.isLoggedIn;
        }

        @Inject()
        public authService!: AuthService;

        public async signIn(provider: "google") {
            await this.authService.signIn(provider);
        }
    }
</script>

<style scoped>
.has-vertical-separator {
    border-right: 1px solid;
    border-right-color: var(--color-border-disabled);
}
</style>