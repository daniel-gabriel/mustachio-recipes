import {createRouter, createWebHistory, type Router} from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import type {AuthService} from "@/services/AuthService";
import {useStateStore} from "@/stores/StateStore";
import LoginView from "@/views/LoginView.vue";

export function initRouter(authService: AuthService): Router {
    const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: "/",
                name: "Dashboard",
                component: DashboardView
            },
            {
                path: "/login",
                name: "Login",
                component: LoginView
            },
            {
                path: "/recipes",
                name: "Recipes",
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import("../views/ListPagedRecipesView.vue"),
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: "/recipe/add",
                name: "CreateRecipe",
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import("../views/CreateRecipeView.vue"),
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: "/recipe/:id",
                name: "DisplayRecipe",
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import("../views/DisplayRecipeDetailsView.vue"),
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: "/recipe/:id/edit",
                name: "UpdateRecipe",
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import("../views/UpdateRecipeView.vue"),
                meta: {
                    requiresAuth: true
                }
            }
        ]
    });

    router.beforeEach((to, from, next) => {
        const stateStore = useStateStore();
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

        if (requiresAuth && !authService.isAuthenticated()) {
            stateStore.setNextUrl(to.fullPath);
            next({name: "Login"});
        } else {
            next();
        }
    });

    return router;
}