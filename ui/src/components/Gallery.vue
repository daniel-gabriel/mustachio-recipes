
<template>
    <!-- show the main carousel -->
    <o-carousel
        :autoplay="false"
    >
        <o-carousel-item v-for="(item, i) in items" :key="i">
            <div class="media-centered">
                <div class="image">
                    <img :src="item.url" :alt="item.displayName || 'A recipe image or video'" class="media-centered"/>
                </div>
            </div>
        </o-carousel-item>
    </o-carousel>
</template>

<script lang="ts">
    import {Component, Prop, Ref, Vue} from "vue-facing-decorator";
    import type {IMediaUrlParams} from "@/components/params/IMediaUrlParams";

    @Component
    export default class Gallery extends Vue {
        @Prop()
        public items!: IMediaUrlParams[];
    }
</script>

<style scoped>
.image img {
    height: auto;
    width: 100%;
    max-height: 600px;
    max-width: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    object-fit: contain;
}
.media-centered {
    margin-left: auto;
    margin-right: auto;
}

</style>