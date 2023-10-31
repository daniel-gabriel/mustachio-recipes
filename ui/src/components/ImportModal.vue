<template>
    <o-modal v-model:active="shouldShowModal"
             :full-screen="false"
             :close-class="null"
             @cancel="doCancel"
    >
        <div class="card">
            <div class="card-header"><span class="card-header-title">Import a Recipe</span></div>

            <div class="card-content">
                <div class="notification is-info">
                    <p>
                        <o-icon icon="circle-info" />
                        Thanks for trying our recipe import feature! Remember, this is still in
                        development, please verify the results. Always check the original website's
                        terms before importing.
                    </p>
                    <p>
                        <em><strong>Any legal consequences from copying are solely your responsibility.
                        Always use with respect for original creators.</strong></em>
                    </p>
                </div>

                <o-field grouped label="Recipe text">
                    <o-input type="textarea" v-model="source" placeholder="Paste or drag-and-drop" expanded />
                    <o-button :disabled="isInProgress || !source" variant="info" icon-left="cloud-arrow-down" @click="doConvert(source)">
                        Import
                    </o-button>
                </o-field>

                <p v-if="isInProgress">
                    <span>Importing takes up to 2 minutes.</span>
                    <progress class="progress is-small is-primary" max="100">15%</progress>
                </p>
                <p v-else-if="recipe">
                    <DisplayRecipeDetails
                        :hide-actions="true"
                        :recipe="recipe"
                    />
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
                <div class="card-footer-item">
                    <div class="buttons">
                        <o-button :disabled="isInProgress || !recipe" icon-left="check" variant="primary" rounded @click="doSubmitUse">
                            Use
                        </o-button>
                        <o-button icon-left="ban" variant="warning" rounded @click="doCancel">Cancel</o-button>
                    </div>
                </div>
            </div>
        </div>
    </o-modal>
</template>

<script lang="ts">
    // TODO:
    // INFRA
    // - add Digital Ocean deployment
    // - add variables and secrets in GitHub Actions to deploy to production
    // - show a loading indicator when coming back after logging in
    // - either make the email login work, or remove that option

    // FOR LATER:
    // - add tests everywhere
    // - add servings/portions, cook time, prep time, and nutrition info per serving (calories, carbs, protein, fat)
    // - "chef.png" should also be svg and have rounded corners

    // x add sign-in
    // x replace the "Home" screen with a welcome message (and maybe show some common stats like # or recipes)
    // x add dependency injection to make the ApiService available where needed
    // x add message to Import Modal saying that the import feature is experimental.
    // x make opening a recipe more apparent - it's not clear that clicking on the recipe title opens it
    // x add a carousel to display images in recipe view
    // x add support for fractions
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
    import DisplayRecipeDetails from "@/components/DisplayRecipeDetails.vue";
    import type {IRecipeUpdateParams} from "@/components/params/IRecipeUpdateParams";

    @Component({
        components: {DisplayRecipeDetails}
    })
    export default class ImportModal extends Vue {
        @Prop({type: null, validator: (v) => v == null || typeof v == "object"})
        public readonly recipe!: IRecipeUpdateParams;

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

        @Emit("convertText")
        public doConvertText(recipeText: string): string {
            this.isInProgress = true;
            return recipeText;
        }

        @Emit("submitUse")
        public doSubmitUse(): IRecipeUpdateParams {
            this.reset();
            return this.recipe;
        }

        @Emit("cancel")
        public doCancel() {
            this.reset();
        }

        public doConvert(textOrUrl: string) {
            this.doConvertText(textOrUrl);
        }

        private reset() {
            this.source = "";
            this.isInProgress = false;
        }
    }
</script>

<style scoped>
</style>