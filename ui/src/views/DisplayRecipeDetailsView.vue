<template>
    <div>
        <!-- Display the list of recipes and handle pagination -->
        <DisplayRecipeDetails
            v-if="recipe"
            :recipe="recipe"
            @edit="goToUpdate"
            @delete="doDelete"
        />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-facing-decorator";
    import {ApiService, type IRecipe} from "@/api";
    import DisplayRecipeDetails from "@/components/DisplayRecipeDetails.vue";
    import {useAlertStore} from "@/stores/AlertStore";

    @Component({
        components: {
            DisplayRecipeDetails
        }
    })
    export default class DisplayRecipeDetailsView extends Vue {
        public recipe: IRecipe | null = null;
        private id: string | undefined;

        private apiService = new ApiService({
            BASE: "http://localhost:3000"
            // TOKEN: async (): Promise<string> => ""
        });
        private readonly alertStore = useAlertStore();

        async mounted() {
            // Assuming the ID is passed in as a route parameter
            this.id = this.$route.params.id as string;
            await this.fetchRecipeById(this.id);
        }

        async fetchRecipeById(id: string) {
            try {
                this.recipe = await this.apiService.recipes.getRecipe({id});
            } catch (error) {
                console.error('Failed to fetch recipe:', error);
                this.alertStore.error('Error fetching the recipe.');
            }
        }

        goToUpdate() {
            this.$router.push({ name: 'UpdateRecipe', params: { id: this.id } });
        }

        async doDelete() {
            if (confirm(`Are you sure you want to delete recipe '${this.recipe?.name}'?`)) {
                try {
                    await this.apiService.recipes.deleteRecipe({id: this.id || ""});
                    this.$router.push({ name: "Recipes"});
                } catch (error) {
                    console.error('Failed to delete recipe:', error);
                    this.alertStore.error('Error deleting the recipe.');
                }
            }
        }
    }
</script>
