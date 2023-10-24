<template>
    <div>
        <h1 class="title">Update Recipe</h1>

        <EditRecipe
            :loading="loading"
            :importedRecipe="recipe"
            :apiErrors="apiErrors"
            @save="updateRecipe"
        />
    </div>
</template>

<script lang="ts">
    import {Component, Inject, Vue} from "vue-facing-decorator";
    import {ApiService} from "@/api";
    import type {IRecipeUpdateParams} from "@/components/params/IRecipeUpdateParams";
    import {useAlertStore} from "@/stores/AlertStore";
    import EditRecipe from "@/components/EditRecipe.vue";
    import {RecipeToRecipeUpdateParamsConverter} from "@/components/converters/RecipeToRecipeUpdateParamsConverter";
    import {RecipeUpdateParamsToRecipeConverter} from "@/components/converters/RecipeUpdateParamsToRecipeConverter";

    @Component({
        components: {
            EditRecipe
        }
    })
    export default class UpdateRecipeView extends Vue {
        public apiErrors: Record<string, unknown> = {};

        public recipe: IRecipeUpdateParams = {
            name: "",
            description: "",
            ingredients: [],
            steps: [],
            mediaUrls: []
        };

        private id: string | undefined;

        @Inject()
        public apiService!: ApiService;

        private readonly alertStore = useAlertStore();

        public loading = false;

        public async mounted() {
            // Assuming the ID is passed in as a route parameter
            this.id = this.$route.params.id as string;
            await this.fetchRecipeById(this.id);
        }

        private async fetchRecipeById(id: string) {
            try {
                this.loading = true;
                const recipe = await this.apiService.recipes.getRecipe({id});
                this.recipe = RecipeToRecipeUpdateParamsConverter.convert(recipe || undefined);
            } catch (error) {
                this.alertStore.error("Error fetching the recipe details.");
            } finally {
                this.loading = false;
            }
        }

        public async updateRecipe(updatedRecipe: IRecipeUpdateParams) {
            try {
                this.loading = true;
                await this.apiService.recipes.updateRecipe({
                    id: this.id || "",
                    requestBody: RecipeUpdateParamsToRecipeConverter.convert(updatedRecipe)
                });
                this.$router.push({ name: "Recipes" }); // Redirect to recipe listing after successful update
            } catch (error: any) {
                console.log(`got an error: ${JSON.stringify(error || {})}`);
                if (error?.status === 400) {
                    this.apiErrors = error?.body?.extraData;
                } else {
                    this.alertStore.error("Error updating the recipe.");
                }
            } finally {
                this.loading = false;
            }
        }
    }
</script>
