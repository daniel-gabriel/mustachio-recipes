<template>
    <main class="content">
        <div v-if="!loggedIn" class="hero">
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
                        <o-button variant="primary">Sign Up</o-button>
                        <o-button variant="info">Log in</o-button>
                    </o-field>
                </div>
            </section>
        </div>
        <div v-else>
            <p><span class="has-text-weight-bold">{{recipeCount}}</span> recipes in your recipe book</p>
        </div>
    </main>
</template>

<script lang="ts">
    import {Component, Inject, Vue} from "vue-facing-decorator";
    import {ApiService} from "@/api";
    import {useAlertStore} from "@/stores/AlertStore";

    @Component
    export default class HomeView extends Vue {
        private readonly alertStore = useAlertStore();

        public readonly siteName = "Mustachio Recipes";
        public recipeCount = 0;
        public get loggedIn() {
            return false;
        }

        public async mounted() {
            try {
                const result = await this.apiService.recipes
                    .getRecipes({pageIndex: 0, pageSize: 1});
                this.recipeCount = result.totalItems;
            } catch (error) {
                this.alertStore.error("Could not get recipe statistics.");
            }
        }

        @Inject()
        public apiService!: ApiService;
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
/*.has-background-img {
    background-image: url("@/assets/big-chef.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}*/
/*.custom-hero {
    position: relative;
}
.custom-hero::before {
    content: "";
    background-image: url("@/assets/big-chef.png");
    background-size: contain; !* Use contain to fit the image within the hero without cropping *!
    background-repeat: no-repeat; !* Prevents the image from repeating *!
    background-position: center center; !* Centers the image *!
    opacity: .5; !* 50% opacity to the image *!

    !* Cover the entire hero *!
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    !* Display the pseudo-element below the actual content *!
    z-index: -1;
}*/
</style>