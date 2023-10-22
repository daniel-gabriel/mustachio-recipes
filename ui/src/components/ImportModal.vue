<template>
    <o-modal v-model:active="shouldShowModal"
             :full-screen="false"
             :close-class="null"
             @cancel="doCancel"
    >
        <div class="card">
            <div class="card-header"><span class="card-header-title">Import a Recipe</span></div>

            <div class="card-content">
                <o-field grouped label="Source (URL or recipe text)">
                    <o-input type="textarea" v-model="source" placeholder="Paste or drag-and-drop" expanded />
                    <o-button :disabled="isInProgress || !source" variant="info" icon-left="cloud-arrow-down" @click="doConvert(source)">
                        Import
                    </o-button>
                </o-field>

                <p v-if="recipe">
                    <DisplayRecipeDetails
                        :hide-actions="true"
                        :recipe="recipe"
                    />
                </p>
                <p v-else-if="isInProgress">
                    <span>Importing takes up to 2 minutes.</span>
                    <progress class="progress is-small is-primary" max="100">15%</progress>
                </p>
                <div v-else-if="importError" class="notification is-warning is-light">
                    <p>
                        <o-icon icon="triangle-exclamation" />
                        {{importError}}
                    </p>
                </div>
                <h4 v-else>No imported data</h4>

            </div>

            <div class="card-footer">
                <span class="card-footer-item">
                    <div class="buttons">
                        <o-button :disabled="isInProgress || !recipe" icon-left="check" variant="primary" rounded @click="doSubmitUse">
                            Use
                        </o-button>
                        <o-button icon-left="ban" variant="warning" rounded @click="doCancel">Cancel</o-button>
                    </div>
                </span>
            </div>
        </div>
    </o-modal>
</template>

<script lang="ts">
    // TODO:
    // - add support for fractions
    // - add a carousel to display images in recipe view
    // - add message to Import Modal saying that the import feature is experimental. Add a list of supported sites to import from
    // - make opening a recipe more apparent - it's not clear that clicking on the recipe title opens it
    // - add dependency injection to make the ApiService available where needed
    // - add sign-in
    // - add support for importing from allrecipes.com (get a list of few other most popular recipe sites)
    // - replace the "Home" screen with a welcome message (and maybe show some common stats like # or recipes)
    // - update the "recipe-placeholder.png" should have transparent background with white silhouette outline, and be .svg
    // - "chef.png" should also be svg and have rounded corners
    // x clean up
    // x add more "units" to the drop-down list
    // x fix displaying validation errors from the API (getting prop names like "ingredients.$0.quantity - blah blah"
    // x "focused" buttons in dark theme have text that's too dark
    // x sort recipes newest-first
    // x add support for pasting images into the media field
    // x investigate if it's possible to tell the browser to keep the screen on
    //   x if yes, add a toggle to keep the screen on when viewing recipe details
    // x set more fitting colors for dark and light themes
    // x style the recipe list "cards" to look better, and to include an image if one exists
    // x style the Recipe Details component
    // x change "edit" to be a different route than "view"
    // x make the navbar have a color (maybe light green?)
    // x add an error popup and use it instead of all alerts
    // x disable the update form and show a loading indicator while saving the recipe
    // x disable the create form and show a loading indicator while saving the recipe
    import {Component, Emit, Prop, Vue, Watch} from "vue-facing-decorator";
    import type {IRecipe} from "@/api";
    import DisplayRecipeDetails from "@/components/DisplayRecipeDetails.vue";

    @Component({
        components: {DisplayRecipeDetails}
    })
    export default class ImportModal extends Vue {
        @Prop({
            type: null,
            validator: (v) => v == null || typeof v == "object"
        })
        public readonly recipe!: IRecipe;

        @Prop({type: Boolean, default: false})
        public readonly isShown!: boolean;

        @Prop({type: String})
        public readonly importError!: string;

        public source: string = null!;

        public isInProgress: boolean = false;

        public get shouldShowModal() {
            return this.isShown;
        }
        public set shouldShowModal(_) {
            // ignore since on cancel we will notify the modal's owner, giving it a chance to update the property
        }

        @Watch("recipe")
        public onRecipeChange() {
            this.isInProgress = false;
        }

        @Watch("importError")
        public onImportErrorChange() {
            this.isInProgress = false;
        }

        @Emit("convertUrl")
        public doConvertUrl(url: string): string {
            this.isInProgress = true;
            return url;
        }

        @Emit("convertText")
        public doConvertText(recipeText: string): string {
            this.isInProgress = true;
            return recipeText;
        }

        @Emit("submitUse")
        public doSubmitUse(): IRecipe {
            this.reset();
            return this.recipe;
        }

        @Emit("cancel")
        public doCancel() {
            this.reset();
        }

        public doConvert(textOrUrl: string) {
            if (/^(https?):\/\/[^\s/$.?#].[^\s]*$/.test(textOrUrl)) {
                // it's a URL
                this.doConvertUrl(textOrUrl);
            } else {
                this.doConvertText(textOrUrl);
            }
        }

        private reset() {
            this.source = "";
            this.isInProgress = false;
        }
    }
</script>

<style scoped>
</style>