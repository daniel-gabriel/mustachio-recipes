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

<!--                <div v-if="authStore.isLoggedIn" class="navbar-item">-->
<!--                    <div class="navbar-item has-dropdown is-hoverable">-->
<!--                        <a class="navbar-link">{{ userDescriptor }}</a>-->

<!--                        <div class="navbar-dropdown">-->
<!--                            <RouterLink class="navbar-item" to="/settings">Settings</RouterLink>-->
<!--                            <a class="navbar-item" @click="async () => await logOut()">Log Out</a>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div v-if="!authStore.isLoggedIn" class="navbar-item has-dropdown is-hoverable">-->
<!--                    <a class="navbar-link">Sign Up</a>-->

<!--                    <div class="navbar-dropdown">-->
<!--                        <RouterLink class="navbar-item" to="/consumer-signup">As Consumer</RouterLink>-->
<!--                        <RouterLink class="navbar-item" to="/vendor-signup">As Vendor</RouterLink>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
    import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
    import {Component, Inject, Vue} from "vue-facing-decorator";
    // import {useAuthStore} from "@/stores/AuthStore";
    import router from "../router";
    // import {useApiStore} from "@/stores/ApiStore";
    // import type {IContainer} from "@/di/IContainer";
    // import type {IAuthService} from "@/services/IAuthService";

    @Component({
        components: {ThemeSwitcher}
    })
    export default class Navbar extends Vue {
        public isNavMenuExpanded: boolean = false;
        // public readonly authStore = useAuthStore();
        // public readonly apiStore = useApiStore();

        // @Inject
        // private readonly ioc!: IContainer;

        // public get userDescriptor(): string {
        //     let descriptor = this.apiStore.profile?.firstName || this.apiStore.profile?.email;
        //     if (descriptor && this.apiStore.profile?.vendor?.businessName) {
        //         descriptor += ` - ${this.apiStore.profile?.vendor.businessName}`;
        //     }
        //     return descriptor || "Unknown";
        // }

        public toggleNavMenu(): void {
            this.isNavMenuExpanded = !this.isNavMenuExpanded;
        }

        // public async logOut(): Promise<void> {
        //     await this.ioc.getRequiredService<IAuthService>("authService").signOut();
        //     await router.push("/login");
        // }
    }
</script>

<style scoped>
.navbar a.navbar-item, .navbar a.navbar-item:visited {
    color: var(--color-heading);
}

.navbar a.navbar-item:hover {
    color: var(--color-heading-em);
}
</style>