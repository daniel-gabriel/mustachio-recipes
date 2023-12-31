<template>
    <div>
        <o-button icon-left="plus" @click="goToCreate">Create/Import Recipe</o-button>

        <o-table
            :data="recipes?.data"
            :loading="loading"
            paginated
            backend-pagination
            :total="recipes?.totalItems"
            :per-page="itemsPerPage"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            backend-sorting
            :mobile-cards="false"
            @page-change="onPageChange"
        >
            <o-table-column
                v-slot="props"
                field=""
                label=""
                >

                <div class="card" :key="props.row.id" @click="goToDisplay(props.row.id)">
                    <header class="card-header is-shadowless">
                        <div class="card-header-title">
                            <span v-if="isMine(props.row)" class="tag is-primary owner">Mine</span>
                            <span v-else class="tag is-warning owner">Friend's</span>
                            <p>{{props.row.name}}</p>
                        </div>
                        <div class="card-header-icon">
                            <o-field v-if="isMine(props.row)">
                                <o-button icon-left="pencil" variant="secondary" @click.stop="goToUpdate(props.row.id)"></o-button>
                                <o-button icon-left="trash" variant="danger" @click.stop="doDelete(props.row)"></o-button>
                            </o-field>
                        </div>
                    </header>
                    <div class="card-content columns">
                        <div class="column">
                            {{props.row.description}}
                        </div>

                        <div class="column is-narrow">
                            <div class="media">
                                <div class="has-text-right">
                                    <figure class="image is-128x128">
                                        <div v-if="props.row.mediaUrls?.length">
                                            <video v-if="isMainMediaAVideo(props.row)" controls>
                                                <source :src="getMainMediaUrl(props.row)" type="video/mp4">
                                            </video>
                                            <img v-else-if="isMainMediaAnImage(props.row)"
                                                 :src="getMainMediaUrl(props.row)"
                                                 alt="Meal image"
                                            >
                                            <img v-else
                                                 src="../assets/recipe-placeholder.png"
                                                 alt="Meal image"
                                            >
                                        </div>
                                    </figure>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </o-table-column>
        </o-table>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from "vue-facing-decorator";
    import type {IPagedList_IRecipe_, IRecipe} from "@/api";
    import {IMediaUrl} from "@/api";
    import {useAuthStore} from "@/stores/AuthStore";

    @Component
    export default class ListPagedRecipes extends Vue {
        private readonly authStore = useAuthStore();

        @Prop({default: false})
        public readonly loading!: boolean;
        
        @Prop({
            required: true,
            type: null,
            validator: (v) => v == null || typeof v == "object",
            default: {
                data: [],
                pageIndex: 0,
                pageSize: 10,
                totalItems: 0,
                totalPages: 0
            }
        })
        public readonly recipes!: IPagedList_IRecipe_;

        @Prop({ required: true, type: Number })
        public readonly currentPage!: number;

        @Prop({ required: true, type: Number })
        public readonly totalPages!: number;

        @Prop({ required: true, type: Number })
        public readonly itemsPerPage!: number;

        public isMainMediaAVideo(recipe: IRecipe): boolean {
            return recipe?.mediaUrls?.[0]?.type === IMediaUrl.type.VIDEO;
        }

        public isMainMediaAnImage(recipe: IRecipe): boolean {
            return recipe?.mediaUrls?.[0]?.type === IMediaUrl.type.IMAGE;
        }

        public getMainMediaUrl(recipe: IRecipe): string|undefined {
            return recipe?.mediaUrls?.[0]?.url;
        }

        public isMine(recipe: IRecipe): boolean {
            return this.authStore.sub === recipe.createdBy;
        }

        @Emit("changePage")
        public onPageChange(page: number) {
            return page;
        }

        @Emit("create")
        public goToCreate() {}

        @Emit("display")
        public goToDisplay(recipeId: string) {
            return recipeId;
        }

        @Emit("update")
        public goToUpdate(recipeId: string) {
            return recipeId;
        }

        public async doDelete(recipe: IRecipe) {
            if (confirm(`Are you sure you want to delete recipe '${recipe?.name}'?`)) {
                this.deleteRecipe(recipe.id);
            }
        }

        @Emit("delete")
        public deleteRecipe(recipeId: string): string {
            return recipeId;
        }
    }
</script>

<style scoped>
.card {
    margin-bottom: 20px;
    cursor: pointer;
}
.image {
    overflow: hidden;
}
.image img, .image video {
    height: auto;
    width: 100%;
    max-height: 128px;
    max-width: 128px;
    display: flex;
    justify-content: center;
    align-items: center;
    object-fit: contain;
}
.tag.owner {
    margin-right: 10px;
}
</style>
