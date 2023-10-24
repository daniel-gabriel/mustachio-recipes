<template>
    <div>
        <h1 class="title">Create New Recipe</h1>

        <ImportModal
            :is-shown="showImportModal"
            :canCancel="[]"
            :recipe="importedRecipe"
            :importError="importError"
            @convertText="doConvertText"
            @submitUse="doSubmitUse"
            @cancel="doCancel"
        />

        <o-button variant="info" icon-left="cloud-arrow-down" @click="doShowImportModal">Import</o-button>

        <EditRecipe
            :loading="loading"
            :importedRecipe="recipe"
            :apiErrors="apiErrors"
            @save="createRecipe"
        />
    </div>
</template>

<script lang="ts">
    import {Component, Inject, Vue} from "vue-facing-decorator";
    import {ApiService, type IRecipe} from "@/api";
    import EditRecipe from "@/components/EditRecipe.vue";
    import type {IRecipeUpdateParams} from "@/components/params/IRecipeUpdateParams";
    import ImportModal from "@/components/ImportModal.vue";
    import {useAlertStore} from "@/stores/AlertStore";
    import {RecipeUpdateParamsToRecipeConverter} from "@/components/converters/RecipeUpdateParamsToRecipeConverter";
    import {RecipeToRecipeUpdateParamsConverter} from "@/components/converters/RecipeToRecipeUpdateParamsConverter";

    @Component({
        components: {
            ImportModal,
            EditRecipe
        }
    })
    export default class CreateRecipeView extends Vue {
        public loading = false;
        public importedRecipe: IRecipeUpdateParams | null = null;
        public importError: string | null = null;
        public showImportModal = false;
        public apiErrors: Record<string, unknown> = {};
        public recipe: IRecipeUpdateParams = {
            name: "",
            description: "",
            ingredients: [],
            steps: [],
            mediaUrls: []
        };

        @Inject()
        public apiService!: ApiService;

        private readonly alertStore = useAlertStore();

        public async createRecipe(newRecipe: IRecipeUpdateParams) {
            try {
                this.loading = true;
                await this.apiService.recipes.createRecipe({
                    requestBody: RecipeUpdateParamsToRecipeConverter.convert(newRecipe)
                });
                this.$router.push({ name: "Recipes" }); // Redirect to recipe listing after successful creation
            } catch (error: any) {
                if (error?.status === 400) {
                    this.apiErrors = error?.body?.extraData;
                } else {
                    this.alertStore.error("Error saving the recipe.");
                }
            } finally {
                this.loading = false;
            }
        }

        public doShowImportModal() {
            this.showImportModal = true;
        }

        public async doConvertText(text: string): Promise<void> {
            try {
                this.importedRecipe = RecipeToRecipeUpdateParamsConverter.convert(
                    await this.apiService.recipes.parseText({
                        requestBody: {source: text}
                    })
                );
            } catch (error) {
                const errorMessage = (error as any)?.body?.extraData?.erroredProperties?.["parseUrlRequest.source"]?.description;
                this.importError = errorMessage || "Could not parse the text";
                this.importedRecipe = null;
            }
        }

        public doSubmitUse(recipe: IRecipeUpdateParams) {
            this.showImportModal = false;
            this.importError = null;
            this.recipe = recipe;
            this.importedRecipe = null;
        }

        public doCancel() {
            this.showImportModal = false;
        }
    }
</script>
