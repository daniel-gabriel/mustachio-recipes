<template>
    <nav class="navbar mb-3" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
                <img alt="logo" src="../assets/chef.png">
            </a>

            <a role="button" class="navbar-burger" :class="{'is-active': isNavMenuExpanded}" aria-label="menu"
                aria-expanded="false" data-target="navbarBurgerMenu" @click="toggleNavMenu"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBurgerMenu" class="navbar-menu" :class="{'is-active': isNavMenuExpanded}">
            <div class="navbar-start">
                <RouterLink class="navbar-item" to="/">Dashboard</RouterLink>
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
                            <a class="navbar-item" @click="async () => await logOut()">Log Out</a>
                        </div>
                    </div>
                </div>
                <div v-if="!authStore.isLoggedIn" class="navbar-item">
                    <google-sign-in-button class="navbar-item" @clicked="signIn('google')"/>
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
    import GoogleSignInButton from "@/components/GoogleSignInButton.vue";

    @Component({
        components: {GoogleSignInButton, ThemeSwitcher}
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

        public async signIn(provider: "google") {
            await this.authService.signIn(provider);
        }

        public async logOut(): Promise<void> {
            await this.authService.signOut();
            await this.router.push({name: "Dashboard"});
        }
    }
</script>

<style scoped>
@media screen and (max-width: 768px) {
    .navbar-brand, .navbar-burger {
        height: 5rem;
    }
    .navbar-burger {
        width: 5rem;
    }
}
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