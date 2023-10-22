import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/recipes",
            name: "Recipes",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/ListPagedRecipesView.vue")
        },
        {
            path: "/recipe/add",
            name: "CreateRecipe",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/CreateRecipeView.vue")
        },
        {
            path: "/recipe/:id",
            name: "DisplayRecipe",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/DisplayRecipeDetailsView.vue")
        },
        {
            path: "/recipe/:id/edit",
            name: "UpdateRecipe",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/UpdateRecipeView.vue")
        }
    ]
});

//TODO: add route guards?

export default router;
