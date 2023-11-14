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

    // - change Recipe View UI to have the text, the buttons, and the switch be larger on mobile

    // FOR LATER:
    // - add tests everywhere
    // - add servings/portions, cook time, prep time, and nutrition info per serving (calories, carbs, protein, fat)
    // - "chef.png" should also be svg and have rounded corners

    // x change gpt prompt to convert all sizes to english, and to get recipe locale
    // x store recipe locale in API
    //   x use this as "test" recipe: https://www.russianfood.com/recipes/recipe.php?rid=122534
    // x change validations for "to taste" in UI and API
    // x add locale selection to recipe edit screen

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