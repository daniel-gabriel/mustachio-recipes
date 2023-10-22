<template>
    <o-table
        :data="mediaUrls"
        :mobile-cards="false"
        :loading="loading"
        draggable
    >
        <o-table-column
            v-slot="props"
        >
            <o-field :message="mediaUrlErrors?.[props.index]" grouped :variant="variant(mediaUrlErrors?.[props.index])">
                <div class="media-preview">
                    <img v-if="props.row.url && isImage(props.row)" width="50" :src="props.row.url" alt="File preview" />
                    <video v-else-if="isVideo(props.row)" controls>
                        <source :src="props.row.url" type="video/mp4">
                    </video>
                </div>

                <o-input v-if="props.row.displayName" disabled v-model="props.row.displayName" placeholder="File Name" expanded></o-input>
                <o-input v-if="!props.row.displayName" v-model="props.row.url" placeholder="Image or Video URL" expanded></o-input>

                <o-button inverted rounded variant="danger" icon-left="xmark" @click="removeMediaUrl(props.index)"></o-button>
            </o-field>
        </o-table-column>

        <template #footer>
            <o-field grouped>
                <o-button icon-left="plus" outlined @click="addMediaUrl">Add link</o-button>
                <span>OR</span>
                <o-upload
                    v-model="files"
                    multiple
                    drag-drop
                    placeholder="Upload from Device"
                    accept="image/*,video/*"
                    @update:model-value="handleFileChange(files)"
                >
                    <section class="has-text-centered">
                        <span><o-icon icon="upload" size="is-small" /></span>
                        <span>Drop your files here or click to upload</span>
                    </section>
                </o-upload>
            </o-field>
        </template>
    </o-table>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from "vue-facing-decorator";
    import {IMediaUrl} from "@/api";
    import {useAlertStore} from "@/stores/AlertStore";
    import type {IMediaUrlParams} from "@/components/params/IMediaUrlParams";
    import {MediaUtils} from "@/utils/MediaUtils";

    @Component
    export default class MediaUrlsGrid extends Vue {
        private readonly alertStore = useAlertStore();
        public files: File[] = [];

        @Prop({ default: () => [] })
        public readonly mediaUrls!: IMediaUrl[];

        @Prop({ default: () => [] })
        public readonly mediaUrlErrors!: string[];


        @Prop({default: false})
        public readonly loading!: boolean;

        public variant(msg?: string) {
            return msg ? "danger" : "";
        }

        public async handleFileChange(files: File[]) {
            let showError = false;
            for (const media of this.files) {
                // Create a preview URL for the selected file
                const type = this.getMediaType(media);

                if (!type) {
                    showError = true;
                } else {
                    this.addMediaUrl({
                        url: await this.fileToDataURL(media),// URL.createObjectURL(media),
                        displayName: media.name,
                    });
                }
            }
            this.files = [];
            if (showError) {
                // Handle unexpected types if necessary (e.g., set a default or clear the input)
                this.alertStore.error("One of the selected files is on an unsupported file type. Please select only images or videos.");
            }
        }

        @Emit("removeMediaUrl")
        public removeMediaUrl(index: number) {
            return index;
        }

        @Emit("addMediaUrl")
        public addMediaUrl(media?: IMediaUrlParams): IMediaUrlParams | null {
            return media || null;
        }

        private getMediaType(media?: File): IMediaUrl.type | null {
            if (media?.type.startsWith("image")) {
                return IMediaUrl.type.IMAGE;
            } else if (media?.type.startsWith("video")) {
                return IMediaUrl.type.VIDEO;
            } else {
                return null;
            }
        }

        public isImage(media: IMediaUrlParams): boolean {
            return ["image", "file"].includes(MediaUtils.getUrlType(media?.url || "") || "");
        }

        public isVideo(media: IMediaUrlParams): boolean {
            const isThisAVideo = MediaUtils.getUrlType(media?.url || "") === "video";
            console.log(`isVideo: ${isThisAVideo}`);
            return isThisAVideo;
        }

        private async fileToDataURL(file: File): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (event: ProgressEvent<FileReader>) => {
                    if (event.target?.result) {
                        resolve(event.target.result as string);
                    } else {
                        reject(new Error("Could not convert the selected file to a data URL"));
                    }
                };

                reader.onerror = () => {
                    reject(new Error("Could not convert the selected file to a data URL"));
                };

                reader.readAsDataURL(file);
            });
        }
    }
</script>

<style scoped>
.media-preview {
    width: 50px;
    height: 50px;
    border: 1px dashed;
    border-radius: 4px;
    overflow: hidden;    /* Ensures media doesn't spill out of the container */
    display: flex;       /* Centers the child elements (img or video) */
    justify-content: center;
    align-items: center;
}
.media-preview img, .media-preview video {
    min-width: 100%;
    min-height: 100%;
    max-width: unset;
    max-height: unset;
    object-fit: contain;   /* Ensures media scales properly and maintains aspect ratio */
}
</style>