<template>
    <div class="content">
        <div class="card">
            <header class="card-header is-shadowless is-flex">
                <div class="card-header-title">
                    <div class="card-header-icon is-flex-grow-1 is-justify-content-flex-end">
                        <KeepScreenOnSwitcher v-if="!hideActions" class="is-size-3-touch is-size-4-tablet is-size-6-fullhd"/>

                        <o-dropdown aria-role="list" class="is-right is-size-3-touch is-size-4-tablet is-size-6-fullhd">
                            <template #trigger="{ active }">
                                <o-button
                                    :icon-right="active ? 'caret-up' : 'caret-down'" />
                            </template>

                            <o-dropdown-item aria-role="listitem">
                                <div class="media has-text-info is-size-3-touch is-size-4-tablet is-size-6-fullhd">
                                    <o-icon class="media-left" icon="pencil" />
                                    <div class="media-content" @click="editRecipe">Edit</div>
                                </div>
                            </o-dropdown-item>
                            <o-dropdown-item aria-role="listitem">
                                <div class="media has-text-danger is-size-3-touch is-size-4-tablet is-size-6-fullhd">
                                    <o-icon class="media-left" icon="trash" />
                                    <div class="media-content" @click="deleteRecipe">Delete</div>
                                </div>
                            </o-dropdown-item>
                        </o-dropdown>
                    </div>
                </div>
            </header>

            <div class="card-content">
                <h1>{{ recipe.name }}</h1>

                <Gallery v-if="recipe.mediaUrls?.length" :items="recipe.mediaUrls"/>

                <p class="is-size-4-touch is-size-5-tablet is-size-6-fullhd">{{ recipe.description }}</p>

                <div class="columns">
                    <div class="column has-vertical-separator is-size-4-touch is-size-5-tablet is-size-6-fullhd">
                        <h4 class="subtitle">Ingredients</h4>
                        <ul>
                            <li v-for="ingredient in recipe.ingredients" :key="ingredient.item">
                                {{ ingredient.item }} - <strong>{{ toFraction(ingredient.quantity) }} {{ unitLabel(ingredient.unit) }}</strong>
                            </li>
                        </ul>
                    </div>

                    <div class="column is-two-thirds is-size-3-touch is-size-4-tablet is-size-6-fullhd">
                        <h4 class="subtitle">Instructions</h4>
                        <ol>
                            <li v-for="step in recipe.steps" :key="step.instructions" class="has-horizontal-separator">
                                {{ step.instructions }}
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from "vue-facing-decorator";
    import type {IRecipe} from "@/api";
    import {LocalesEnum, UnitsEnum} from "@/api";
    import KeepScreenOnSwitcher from "@/components/KeepScreenOnSwitcher.vue";
    import Gallery from "@/components/Gallery.vue";
    import {NumberUtils} from "@/utils/NumberUtils";
    import {unitsList} from "@/components/UnitsList";
    import {useAuthStore} from "@/stores/AuthStore";

    @Component({
        components: {Gallery, KeepScreenOnSwitcher}
    })
    export default class DisplayRecipeDetails extends Vue {
        private readonly authStore = useAuthStore();

        @Prop()
        public recipe!: IRecipe;

        @Prop({default: false})
        public hideActions!: boolean;

        public get isMine(): boolean {
            return this.authStore.sub === this.recipe.createdBy;
        }

        public unitLabel(unit: string) {
            if (!Object.values(UnitsEnum).includes(unit as UnitsEnum)) {
                return "";
            }
            const localeName = (this.recipe.locale && this.recipe.locale !== LocalesEnum.UNSUPPORTED) ?
                this.recipe.locale : LocalesEnum.EN_US;
            return unitsList.find(u => u.value === unit)?.label[localeName] || "";
        }

        @Emit("edit")
        public editRecipe(): string {
            return this.recipe.id;
        }

        @Emit("delete")
        public deleteRecipe(): string {
            return this.recipe.id;
        }

        public toFraction(quantity: number | null) {
            return quantity ? NumberUtils.toFraction(quantity) : "";
        }
    }
</script>

<style scoped>

</style>