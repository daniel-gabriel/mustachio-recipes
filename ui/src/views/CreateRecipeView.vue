<template>
    <div>
        <h1 class="title">Create New Recipe</h1>

        <ImportModal
            :is-shown="showImportModal"
            :canCancel="[]"
            :recipe="importedRecipe"
            :importError="importError"
            @convertUrl="doConvertUrl"
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
    import {Component, Vue} from "vue-facing-decorator";
    import {ApiService, type IRecipe, ITextParseRequest} from "@/api";
    import EditRecipe from "@/components/EditRecipe.vue";
    import type {IRecipeUpdateParams} from "@/components/params/IRecipeUpdateParams";
    import ImportModal from "@/components/ImportModal.vue";
    import type = ITextParseRequest.type;
    import {useAlertStore} from "@/stores/AlertStore";
    import {RecipeUpdateParamsToRecipeConverter} from "@/components/converters/RecipeUpdateParamsToRecipeConverter";

    @Component({
        components: {
            ImportModal,
            EditRecipe
        }
    })
    export default class CreateRecipeView extends Vue {
        public loading = false;
        public importedRecipe: IRecipe | null = null;
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

        private apiService = new ApiService({
            BASE: "http://localhost:3000"
            // TOKEN: async (): Promise<string> => ""
        });
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

        public async doConvertUrl(url: string): Promise<void> {
            try {
                this.importedRecipe = await this.apiService.recipes.parseUrl({
                    requestBody: { source: url }
                });
            } catch (error) {
                console.log(`error: ${JSON.stringify(error)}`);
                const errorMessage = (error as any)?.body?.extraData?.erroredProperties?.["parseUrlRequest.source"]?.description;
                this.importError = errorMessage || "Could not parse the URL";
                this.importedRecipe = null;
            }
        }

        public async doConvertText(text: string): Promise<void> {
            try {
                this.importedRecipe = await this.apiService.recipes.parseText({
                    requestBody: {source: text, type: type.TEXT}
                })
            } catch (error) {
                const errorMessage = (error as any)?.body?.extraData?.erroredProperties?.["parseUrlRequest.source"]?.description;
                this.importError = errorMessage || "Could not parse the text";
                this.importedRecipe = null;
            }
        }

        public doSubmitUse(recipe: IRecipe) {
            this.showImportModal = false;
            this.importError = null;
            this.recipe = RecipeUpdateParamsToRecipeConverter.convert(recipe);
            this.importedRecipe = null;
        }

        public doCancel() {
            this.showImportModal = false;
        }
    }
</script>
