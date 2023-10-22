<template>
    <o-table
        :data="steps"
        :mobile-cards="false"
        :loading="loading"
        draggable
    >
        <o-table-column
            v-slot="props"
        >
            <o-field :message="stepErrors?.[props.index]" grouped :variant="variant(stepErrors?.[props.index])">
                <o-input v-model="props.row.instructions" placeholder="Instruction step" expanded></o-input>
                <o-button inverted rounded variant="danger" icon-left="xmark" @click="removeStep(props.index)"></o-button>
            </o-field>
        </o-table-column>

        <template #footer>
            <o-button icon-left="plus" outlined @click="addStep">Add Step</o-button>
        </template>
    </o-table>
</template>

<script lang="ts">
    import { Component, Vue, Prop, Emit } from "vue-facing-decorator";
    import type {IStep} from "@/api";

    @Component
    export default class StepsGrid extends Vue {
        @Prop({ default: () => [] })
        public readonly steps!: IStep[];

        @Prop({ default: () => [] })
        public readonly stepErrors!: string[];


        @Prop({default: false})
        public readonly loading!: boolean;

        public variant(msg?: string) {
            return msg ? "danger" : "";
        }

        @Emit("removeStep")
        removeStep(index: number) {
            return index;
        }

        @Emit("addStep")
        addStep() {}
    }
</script>