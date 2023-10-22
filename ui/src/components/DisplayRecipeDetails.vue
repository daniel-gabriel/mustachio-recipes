<template>
    <div class="content">
        <div class="card">
            <header class="card-header is-shadowless">
                <h1 class="card-header-title">{{ recipe.name }}</h1>

                <KeepScreenOnSwitcher v-if="!hideActions" />
                <o-field v-if="!hideActions" class="card-header-icon">
                    <o-button icon-left="pencil" variant="secondary" @click="editRecipe" title="Edit"></o-button>
                    <o-button icon-left="trash" variant="danger" @click="deleteRecipe" title="Delete"></o-button>
                </o-field>
            </header>

            <div class="card-content">
                <article class="media">
                    <div class="media-centered">
                        <div v-if="!recipe.mediaUrls.length">
                            <figure class="image">
                                <img src="../assets/recipe-placeholder.png" alt="Recipe image placeholder" />
                            </figure>
                        </div>
                        <div v-for="media in recipe.mediaUrls" :key="media.url">
                            <figure class="image">
                                <img v-if="isImage(media)" :src="media.url" :alt="'Image of ' + recipe.name">
                                <video v-else-if="isVideo(media)" controls>
                                    <source :src="media.url" type="video/mp4">
                                </video>
                                <a v-else :href="media.url">{{ media.url }}</a>
                            </figure>
                        </div>
                    </div>
                </article>

                <p class="">{{ recipe.description }}</p>

                <h4 class="subtitle">Ingredients</h4>
                <ul>
                    <li v-for="ingredient in recipe.ingredients" :key="ingredient.item">
                        {{ ingredient.quantity }} {{ ingredient.unit }} of {{ ingredient.item }}
                    </li>
                </ul>

                <h4 class="subtitle">Instructions</h4>
                <ol>
                    <li v-for="step in recipe.steps" :key="step.instructions">{{ step.instructions }}</li>
                </ol>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from "vue-facing-decorator";
    import type {IRecipe} from "@/api";
    import {IMediaUrl} from "@/api";
    import KeepScreenOnSwitcher from "@/components/KeepScreenOnSwitcher.vue";

    @Component({
        components: {KeepScreenOnSwitcher}
    })
    export default class DisplayRecipeDetails extends Vue {
        @Prop()
        public recipe!: IRecipe;

        @Prop({default: false})
        public hideActions!: boolean;

        public isImage(media: IMediaUrl): boolean {
            return media?.type === IMediaUrl.type.IMAGE;
        }

        public isVideo(media: IMediaUrl): boolean {
            return media?.type === IMediaUrl.type.VIDEO;
        }

        @Emit("edit")
        public editRecipe(): string {
            return this.recipe.id;
        }

        @Emit("delete")
        public deleteRecipe(): string {
            return this.recipe.id;
        }
    }
</script>

<style scoped>
.media .image {
    max-height: 200px;
    max-width: 200px;
    overflow: hidden;    /* Ensures media doesn't spill out of the container */
    display: flex;       /* Centers the child elements (img or video) */
    justify-content: center;
    align-items: center;
}
.media .image img, .media .image video {
    /*max-height: 200px;*/
    margin: 10px;
    min-width: 100%;
    min-height: 100%;
    max-width: unset;
    max-height: unset;
    object-fit: contain;   /* Ensures media scales properly and maintains aspect ratio */
}
.media-centered {
    margin-left: auto;
    margin-right: auto;
}
</style>