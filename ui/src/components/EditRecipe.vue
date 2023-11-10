<template>
    <div>
        <!-- General info -->
        <o-field label="Name" :message="errors.name" :variant="variant(errors.name as string)">
            <o-input ref="recipeName" :disabled="loading" v-model="recipe.name" placeholder="Enter recipe name"></o-input>
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
                ref="ingredientGrid"
                :loading="loading"
                :ingredients="recipe.ingredients"
                :ingredientErrors="errors?.ingredients"
                @removeIngredient="removeIngredient"
                @addIngredient="addIngredient"
            />
        </o-field>

        <!-- Steps -->
        <o-field label="Steps" :message="errors.stepsCollection"
                 :variant="variant(errors.stepsCollection as string)">
            <StepsGrid
                ref="stepGrid"
                :loading="loading"
                :steps="recipe.steps"
                :stepErrors="errors?.steps"
                @removeStep="removeStep"
                @addStep="addStep"
            />
        </o-field>

        <!-- Media -->
        <o-field label="Media" :message="errors.mediaUrlsCollection">
            <MediaUrlsGrid
                ref="mediaUrlGrid"
                :loading="loading"
                :media-urls="recipe.mediaUrls"
                :media-url-errors="errors.mediaUrls"
                @removeMediaUrl="removeMedia"
                @addMediaUrl="addMedia"
            />
        </o-field>

        <!-- Original source -->
        <o-field label="Original source (like a URL)" :message="errors.source" :variant="variant(errors.source as string)">
            <o-input :disabled="loading" v-model="recipe.source" placeholder="Enter recipe source, like a URL"></o-input>
        </o-field>

        <!-- Submit -->
        <o-button icon-left="floppy-disk" :loading="loading" variant="primary" rounded @click="submitSave">Save</o-button>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Ref, Vue, Watch} from "vue-facing-decorator";
    import IngredientsGrid from "@/components/IngredientsGrid.vue";
    import MediaUrlsGrid from "@/components/MediaUrlsGrid.vue";
    import StepsGrid from "@/components/StepsGrid.vue";
    import type {IRecipeUpdateParams} from "@/components/params/IRecipeUpdateParams";
    import type {IMediaUrlParams} from "@/components/params/IMediaUrlParams";
    import {nameof} from "@/utils/Helpers";
    import Fraction from "fraction.js";

    @Component({
        components: {StepsGrid, MediaUrlsGrid, IngredientsGrid}
    })
    export default class EditRecipe extends Vue {
        @Prop({
            type: null,
            validator: (v) => v == null || typeof v == "object"
        })
        public readonly importedRecipe!: IRecipeUpdateParams;

        @Prop({default: false})
        public readonly loading!: boolean;

        @Prop()
        public readonly apiErrors!: Record<string, {description: string}>;

        @Ref
        public readonly ingredientGrid!: IngredientsGrid;

        @Ref
        public readonly stepGrid!: StepsGrid;

        @Ref
        public readonly mediaUrlGrid!: MediaUrlsGrid;

        @Ref
        public readonly recipeName!: HTMLElement;

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
            const regex = (prefix: string) => new RegExp(`^${prefix}\\.(\\d+)\\..+$`);
            Object.keys(this.apiErrors).forEach(e => {
                if (e.startsWith(nameof<IErrors>("ingredients"))) {
                    const index = +e.match(regex(nameof<IErrors>("ingredients")))![1];
                    if (!this.errors.ingredients) {
                        this.errors.ingredients = [];
                    }
                    this.errors.ingredients[index] = this.apiErrors[e].description;
                } else if (e.startsWith(nameof<IErrors>("steps"))) {
                    const index = +e.match( regex(nameof<IErrors>("steps")))![1];
                    if (!this.errors.steps) {
                        this.errors.steps = [];
                    }
                    this.errors.steps[index] = this.apiErrors[e].description;
                } else if (e.startsWith(nameof<IErrors>("mediaUrls"))) {
                    const index = +e.match(regex(nameof<IErrors>("mediaUrlsCollection")))![1];
                    if (!this.errors.mediaUrls) {
                        this.errors.mediaUrls = [];
                    }
                    this.errors.mediaUrls[index] = this.apiErrors[e].description;
                } else if (e.startsWith(nameof<IErrors>("name"))) {
                    this.errors.name = this.apiErrors[e].description;
                } else if (e.startsWith(nameof<IErrors>("description"))) {
                    this.errors.description = this.apiErrors[e].description;
                } else if (e.startsWith(nameof<IErrors>("source"))) {
                    this.errors.source = this.apiErrors[e].description;
                } else if (e.startsWith(nameof<IErrors>("additionalNotes"))) {
                    this.errors.additionalNotes = this.apiErrors[e].description;
                }
            });
        }

        mounted() {
            this.recipeName.focus();
        }

        public variant(msg?: string) {
            return msg ? "danger" : "";
        }

        public addIngredient() {
            this.recipe.ingredients.push({});
            this.ingredientGrid.focusLastRowInput();
        }

        public removeIngredient(index: number) {
            this.recipe.ingredients.splice(index, 1);
        }

        public addStep() {
            this.recipe.steps.push({});
            this.stepGrid.focusLastRowInput();
        }

        public removeStep(index: number) {
            this.recipe.steps.splice(index, 1);
        }

        public addMedia(media: IMediaUrlParams | null) {
            this.recipe.mediaUrls.push(media || {});
            this.mediaUrlGrid.focusLastRowInput();
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
            let hasErrors = false;
            this.errors = {
                ingredients: [],
                steps: [],
                mediaUrls: []
            };

            if (!this.recipe.name) {
                this.errors.name = "Name is required";
                hasErrors = true;
            }

            if (!this.recipe.description) {
                this.errors.description = "Description is required";
                hasErrors = true;
            }

            if (!this.recipe.ingredients?.length) {
                this.errors.ingredientsCollection = "At least 1 ingredient is required."
                hasErrors = true;
            } else {
                this.recipe.ingredients.forEach((ing, i) => {
                    if (!ing.item || !ing.unit || !ing.quantity) {
                        this.errors.ingredients![i] =
                            "The name, valid quantity, and a unit of measure are required for each ingredient.";
                        hasErrors = true;
                    }
                    if (!this.isNumberOrFraction(ing.quantity)) {
                        this.errors.ingredients![i] = "The quantity must be a number - whole, decimal or fraction";
                        hasErrors = true;
                    }
                });
            }

            if (!this.recipe.steps?.length) {
                this.errors.stepsCollection = "At least 1 step is required."
                hasErrors = true;
            } else {
                this.recipe.steps.forEach((s, i) => {
                    if (!s.instructions) {
                        this.errors.steps![i] = "Every instruction step is required to have some text.";
                        hasErrors = true;
                    }
                });
            }

            this.recipe.mediaUrls?.forEach((s, i) => {
                if (!s.url) {
                    this.errors.mediaUrls![i] = "Every image or video is required to have an image or video URL, or be an attached file.";
                    hasErrors = true;
                }
            });

            return !hasErrors;
        }

        private isNumberOrFraction(num?: string) {
            try {
                new Fraction(num || "");
                return true;
            } catch {
                return false;
            }
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
