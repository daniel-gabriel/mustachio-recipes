<template>
    <div>
        <o-field label="Name" :message="errors.name" :variant="variant(errors.name as string)">
            <o-input :disabled="loading" v-model="recipe.name" placeholder="Enter recipe name"></o-input>
        </o-field>
        <o-field label="Original source (like a URL)" :message="errors.source" :variant="variant(errors.source as string)">
            <o-input :disabled="loading" v-model="recipe.source" placeholder="Enter recipe source, like a URL"></o-input>
        </o-field>

        <o-field label="Description" :message="errors.description" :variant="variant(errors.description as string)">
            <o-input :disabled="loading" v-model="recipe.description" type="textarea" placeholder="Enter recipe description"></o-input>
        </o-field>

        <o-field label="Additional notes" :message="errors.additionalNotes" :variant="variant(errors.additionalNotes as string)">
            <o-input :disabled="loading" v-model="recipe.additionalNotes" type="textarea" placeholder="Enter additional notes for yourself"></o-input>
        </o-field>

        <!-- Ingredients -->

        <o-field label="Ingredients" :message="errors.ingredientsCollection"
                 :variant="variant(errors.ingredientsCollection as string)">
            <IngredientsGrid
                :loading="loading"
                :ingredients="recipe.ingredients"
                :ingredientErrors="errors?.ingredients"
                @removeIngredient="removeIngredient"
                @addIngredient="addIngredient"
            />
        </o-field>

        <!-- Steps -->
        <o-field label="Steps" :message="errors.stepsCollection">
            <StepsGrid
                :loading="loading"
                :steps="recipe.steps"
                :stepErrors="errors?.steps"
                @removeStep="removeStep"
                @addStep="addStep"
            />
        </o-field>

        <o-field label="Media" :message="errors.mediaUrlsCollection">
            <MediaUrlsGrid
                :loading="loading"
                :media-urls="recipe.mediaUrls"
                :media-url-errors="errors.mediaUrls"
                @removeMediaUrl="removeMedia"
                @addMediaUrl="addMedia"
            />
        </o-field>

        <o-button icon-left="floppy-disk" :loading="loading" variant="primary" rounded @click="submitSave">Save</o-button>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue, Watch} from "vue-facing-decorator";
    import {type IRecipe} from "@/api";
    import IngredientsGrid from "@/components/IngredientsGrid.vue";
    import MediaUrlsGrid from "@/components/MediaUrlsGrid.vue";
    import StepsGrid from "@/components/StepsGrid.vue";
    import type {IRecipeUpdateParams} from "@/components/params/IRecipeUpdateParams";
    import type {IMediaUrlParams} from "@/components/params/IMediaUrlParams";

    @Component({
        components: {StepsGrid, MediaUrlsGrid, IngredientsGrid}
    })
    export default class EditRecipe extends Vue {
        @Prop({
            type: null,
            validator: (v) => v == null || typeof v == "object"
        })
        public readonly importedRecipe!: IRecipe;

        @Prop({default: false})
        public readonly loading!: boolean;

        @Prop()
        public readonly apiErrors!: Record<string, {description: string}>;

        public errors: IErrors = {};

        public recipe: IRecipeUpdateParams = {
            name: "",
            description: "",
            ingredients: [],
            steps: [],
            mediaUrls: []
        };

        @Watch("importedRecipe")
        public onImportedRecipe() {
            this.recipe = this.importedRecipe;
        }

        @Watch("apiErrors")
        public onApiErrors() {
            if (!this.apiErrors) {
                return;
            }
            Object.keys(this.apiErrors).forEach(e => {
                if (e.startsWith("ingredients")) {
                    const index = +e.match(/^ingredients\.(\d+)\..+$/)![1];
                    if (!this.errors.ingredients) {
                        this.errors.ingredients = [];
                    }
                    this.errors.ingredients[index] = this.apiErrors[e].description;
                }
                // this.errors.ingredients = this.apiErrors
            });
        }

        public variant(msg?: string) {
            return msg ? "danger" : "";
        }

        public addIngredient() {
            this.recipe.ingredients.push({});
        }

        public removeIngredient(index: number) {
            this.recipe.ingredients.splice(index, 1);
        }

        public addStep() {
            this.recipe.steps.push({});
        }

        public removeStep(index: number) {
            this.recipe.steps.splice(index, 1);
        }

        public addMedia(media: IMediaUrlParams | null) {
            this.recipe.mediaUrls.push(media || {});
        }

        public removeMedia(index: number) {
            this.recipe.mediaUrls.splice(index, 1);
        }

        public submitSave() {
            if (!this.validateRecipe()) {
                return;
            }
            this.onSave(this.recipe);
        }

        @Emit("save")
        public onSave(recipe: IRecipeUpdateParams): IRecipeUpdateParams {
            return recipe;
        }

        private validateRecipe(): boolean {
            this.errors = {};

            if (!this.recipe.name) {
                this.errors.name = "Name is required";
            }

            if (!this.recipe.description) {
                this.errors.description = "Description is required";
            }

            if (!this.recipe.ingredients?.length) {
                this.errors.ingredientsCollection = "At least 1 ingredient is required."
            } else {
                this.recipe.ingredients.forEach((ing, i) => {
                    if (!ing.item || !ing.unit || !ing.quantity) {
                        if (!this.errors.ingredients) {
                            this.errors.ingredients = [];
                        }
                        (this.errors.ingredients as string[])[i] =
                            "The name, valid quantity, and a unit of measure are required for each ingredient.";
                    }
                })
            }

            if (!this.recipe.steps?.length) {
                this.errors.stepsCollection = "At least 1 step is required."
            } else {
                this.recipe.steps.forEach((s, i) => {
                    if (!s.instructions) {
                        if (!this.errors.steps) {
                            this.errors.steps = [];
                        }
                        (this.errors.steps as string[])[i] =
                            "Every instruction step is required to have some text.";
                    }
                })
            }

            this.recipe.mediaUrls?.forEach((s, i) => {
                if (!s.url) {
                    if (!this.errors.mediaUrls) {
                        this.errors.mediaUrls = [];
                    }
                    (this.errors.mediaUrls as string[])[i] =
                        "Every image or video is required to have an image or video URL, or be an attached file.";
                }
            })

            return Object.keys(this.errors).length === 0;
        }
    }

    interface IErrors {
        name?: string;
        description?: string;
        additionalNotes?: string;
        source?: string;
        ingredientsCollection?: string;
        ingredients?: string[];
        stepsCollection?: string;
        steps?: string[];
        mediaUrlsCollection?: string;
        mediaUrls?: string[];
    }
</script>
