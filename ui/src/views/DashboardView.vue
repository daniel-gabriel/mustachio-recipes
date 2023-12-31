<template>
    <main class="content">
        <div v-if="isLoading" class="is-fullwidth" style="height: 100vh;">
            <o-loading v-model:active="isLoading" :full-page="false">
                <o-icon icon="sync-alt" size="large" spin />
            </o-loading>
        </div>
        <div v-else-if="!loggedIn" class="hero">
            <section class="hero-head">
                <h1 class="title has-text-centered is-primary">Welcome to {{ siteName }}!</h1>
            </section>
            <section class="hero-body">
                <div class="columns is-vcentered">
                    <div class="column is-narrow is-hidden-mobile">
                        <img src="@/assets/big-chef.png" alt="Picture of a chef" style="height: 350px; width: auto;"/>
                    </div>
                    <div class="column">
                        <p class="subtitle">
                            Hello, passionate home cook! We're thrilled to have you here.
                        </p>
                        <p class="subtitle">
                            Imagine a cozy corner in your kitchen, dedicated just for your favorite recipes.
                            That's what {{ siteName }} is for you - your own digital recipe book.
                        </p>

                        <ul class="subtitle">
                            <li>
                                Every recipe you add here is just for you, safely tucked away in
                                your private collection.
                            </li>
                            <li> No distractions, no clutter.</li>
                            <li>Your cherished recipes all in one place.</li>
                        </ul>

                        <p class="subtitle">
                            Ready to embark on this delicious journey? Let's get started, and may your kitchen always be filled
                            with delightful aromas and joy!
                        </p>
                    </div>
                </div>
            </section>
            <section class="hero-foot">
                <div class="footer-container">
                    <o-field grouped class="centered-field">
                        <google-sign-in-button @clicked="signIn('google')"/>
                    </o-field>
                </div>
            </section>
        </div>
        <div v-else>
            <p><span class="has-text-weight-bold">{{ myRecipesCount }}</span> recipe(s) that you own</p>
            <p><span class="has-text-weight-bold">{{ friendsRecipesCount }}</span> recipe(s) that your friends own</p>
        </div>
    </main>
</template>

<script lang="ts">
    import {Component, Inject, Vue, Watch} from "vue-facing-decorator";
    import {ApiService} from "@/api";
    import {useAlertStore} from "@/stores/AlertStore";
    import type {AuthService} from "@/services/AuthService";
    import {nameof} from "@/utils/Helpers";
    import {useAuthStore} from "@/stores/AuthStore";
    import GoogleSignInButton from "@/components/GoogleSignInButton.vue";

    @Component({
        components: {GoogleSignInButton}
    })
    export default class DashboardView extends Vue {
        private readonly alertStore = useAlertStore();
        private readonly authStore = useAuthStore();

        public readonly siteName = "Mustachio Recipes";
        public myRecipesCount = 0;
        public friendsRecipesCount = 0;
        public isLoading = false;

        public get loggedIn() {
            return this.authStore.isLoggedIn;
        }

        @Watch(nameof<DashboardView>("loggedIn"))
        public async onLoggedInChanged() {
            if (this.loggedIn) {
                await this.getStats();
            }
        }

        @Inject()
        public apiService!: ApiService;

        @Inject()
        public authService!: AuthService;

        public async mounted() {
            if (this.loggedIn) {
                await this.getStats();
            }
        }

        public async signIn(provider: "google") {
            await this.authService.signIn(provider);
        }

        private async getStats() {
            try {
                this.isLoading = true;
                const result = await this.apiService.recipes.getStats();
                this.myRecipesCount = result.myRecipesCount;
                this.friendsRecipesCount = result.friendsRecipesCount;
            } catch (error) {
                this.alertStore.error("Could not get recipe statistics.");
            } finally {
                this.isLoading = false;
            }
        }
    }
</script>

<style scoped>
.footer-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
.centered-field {
    margin: 0 auto;
}
</style>