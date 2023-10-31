<template>
    <nav class="navbar mb-3" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
                <img alt="logo" src="../assets/chef.png" :height="28">
            </a>

            <a role="button" class="navbar-burger" aria-label="menu"
                aria-expanded="false" data-target="navbarBurgerMenu" @click="toggleNavMenu"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBurgerMenu" class="navbar-menu" :class="{'is-active': isNavMenuExpanded}">
            <div class="navbar-start">
                <RouterLink class="navbar-item" to="/">Home</RouterLink>
                <RouterLink class="navbar-item" to="/recipes">Recipes</RouterLink>
            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <ThemeSwitcher />
                </div>

                <div v-if="authStore.isLoggedIn" class="navbar-item">
                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">{{ userDescriptor }}</a>

                        <div class="navbar-dropdown is-right">
<!--                            <RouterLink class="navbar-item" to="/settings">Settings</RouterLink>-->
                            <a class="navbar-item" @click="async () => await logOut()">Log Out</a>
                        </div>
                    </div>
                </div>
                <div v-if="!authStore.isLoggedIn" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">Log In</a>

                    <div class="navbar-dropdown is-right">
                        <a class="navbar-item" @click="signIn('google')">with Google</a>
                        <a class="navbar-item" @click="signIn('email')">with Email</a>
<!--                        <RouterLink class="navbar-item" to="/consumer-signup">with Google</RouterLink>-->
<!--                        <RouterLink class="navbar-item" to="/vendor-signup">with Email</RouterLink>-->
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
    import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
    import {Component, Inject, Vue} from "vue-facing-decorator";
    import type {Router} from "vue-router";
    import type {AuthService} from "@/services/AuthService";
    import {useAuthStore} from "@/stores/AuthStore";

    @Component({
        components: {ThemeSwitcher}
    })
    export default class Navbar extends Vue {
        public isNavMenuExpanded: boolean = false;

        @Inject()
        private router!: Router;

        @Inject()
        private authService!: AuthService;

        public readonly authStore = useAuthStore();

        public get userDescriptor(): string {
            const user = this.authService.getUser();
            return user?.displayName || user?.email || "Unknown";
        }

        public toggleNavMenu(): void {
            this.isNavMenuExpanded = !this.isNavMenuExpanded;
        }

        public async signIn(provider: "google" | "email") {
            await this.authService.signIn(provider);
        }

        public async logOut(): Promise<void> {
            await this.authService.signOut();
            await this.router.push({name: "Home"});
        }
    }
</script>

<style scoped>
.navbar a.navbar-item,
.navbar a.navbar-item:visited,
.navbar a.navbar-link,
.navbar a.navbar-link:visited {
    color: var(--color-heading);
}

.navbar a.navbar-item:hover,
.navbar a.navbar-link:hover,
.navbar a.navbar-item:active,
.navbar a.navbar-link:active,
.navbar .navbar-item.has-dropdown:hover .navbar-link {
    color: var(--color-heading-em);
}
</style>