<template>
    <div>
        <h1 class="title">Recipes</h1>

        <ListPagedRecipes
            :loading="loading"
            :recipes="recipes"
            :currentPage="currentPage"
            :totalPages="totalPages"
            :itemsPerPage="itemsPerPage"
            @changePage="loadRecipes"
            @delete="deleteRecipe"
            @create="goToCreate"
            @display="goToDisplay"
            @update="goToUpdate"
        />
    </div>
</template>

<script lang="ts">
    import {Component, Inject, Vue} from "vue-facing-decorator";
    import {ApiService, type IPagedList_IRecipe_} from "@/api";
    import ImportModal from "@/components/ImportModal.vue";
    import ListPagedRecipes from "@/components/ListPagedRecipes.vue";
    import {useAlertStore} from "@/stores/AlertStore";

    @Component({
        components: {
            ImportModal,
            ListPagedRecipes
        }
    })
    export default class ListPagedRecipesView extends Vue {
        public loading: boolean = false;
        public recipes: IPagedList_IRecipe_ = null!;
        public currentPage: number = 1;
        public itemsPerPage: number = 5;
        public totalItems: number = 0;

        @Inject()
        public apiService!: ApiService;

        private readonly alertStore = useAlertStore();

        get totalPages(): number {
            if (!this.recipes) {
                return 0;
            }
            return Math.ceil(this.recipes.totalItems / this.itemsPerPage);
        }

        async mounted() {
            await this.loadRecipes(this.currentPage);
        }

        async loadRecipes(page: number) {
            try {
                this.loading = true;
                this.currentPage = page;
                const response = await this.apiService.recipes.getRecipes({
                    pageIndex: this.currentPage - 1,
                    pageSize: this.itemsPerPage
                });
                console.log(JSON.stringify(response));
                this.recipes = response;
                this.totalItems = response.totalItems;
            } catch (error) {
                console.error("Failed to fetch recipes:", error);
                this.alertStore.error("Error getting recipes.");
            } finally {
                this.loading = false;
            }
        }

        async deleteRecipe(recipeId: string) {
            try {
                await this.apiService.recipes.deleteRecipe({id: recipeId});
                await this.loadRecipes(this.currentPage);
            } catch (error) {
                console.error("Failed to delete recipe:", error);
                this.alertStore.error("Error deleting the recipe.");
            }
        }

        goToCreate() {
            this.$router.push({ name: "CreateRecipe" }); // Assuming you have named routes
        }

        goToDisplay(recipeId: string) {
            this.$router.push({ name: "DisplayRecipe", params: { id: recipeId } });
        }

        goToUpdate(recipeId: string) {
            this.$router.push({ name: "UpdateRecipe", params: { id: recipeId } });
        }
    }
</script>
