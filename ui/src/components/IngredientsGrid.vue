<template>
    <o-table
        :data="ingredients"
        :mobile-cards="false"
        :loading="loading"
        draggable
    >

        <!-- Columns -->
        <o-table-column
            v-slot="props"
        >
            <o-field :message="ingredientErrors?.[props.index]" grouped :variant="variant(ingredientErrors?.[props.index])">
                <o-input v-model="props.row.item" placeholder="Name" expanded></o-input>
                <o-input v-model="props.row.quantity" placeholder="Quantity"></o-input>
                <o-select v-model="props.row.unit" placeholder="Unit">
                    <option v-for="unit in unitsList" :value="unit.value">{{ label(unit) }}</option>
                </o-select>
                <o-button inverted rounded variant="danger" icon-left="xmark" @click="removeIngredient(props.index)"></o-button>
            </o-field>
        </o-table-column>

        <!-- Footer -->
        <template #footer>
            <o-button icon-left="plus" outlined @click="addIngredient">Add Ingredient</o-button>
        </template>
    </o-table>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from "vue-facing-decorator";
    import type {IIngredientParams} from "@/components/params/IIngredientParams";
    import type {IUnit} from "@/components/UnitsList";
    import {unitsList} from "@/components/UnitsList";
    import {LocalesEnum} from "@/api";

    @Component
    export default class IngredientsGrid extends Vue {
        @Prop({default: () => []})
        public readonly ingredients!: IIngredientParams[];

        @Prop({default: () => []})
        public readonly ingredientErrors!: string[];

        @Prop({default: false})
        public readonly loading!: boolean;

        @Prop({default: "en-US"})
        public readonly locale!: LocalesEnum;

        public unitsList = unitsList;

        public variant(msg?: string) {
            return msg ? "danger" : "";
        }

        public label(unit: IUnit): string {
            const localeName = (this.locale && this.locale !== LocalesEnum.UNSUPPORTED) ? this.locale : LocalesEnum.EN_US;
            return unit.label[localeName];
        }

        public focusLastRowInput(placeholder: string = "Name") {
            this.$nextTick(() => {
                const inputs = this.$el.querySelectorAll(`input[placeholder="${placeholder}"]`);
                const lastInput = inputs[inputs.length - 1] as HTMLInputElement | undefined;
                lastInput?.focus();
            });
        }

        @Emit("removeIngredient")
        public removeIngredient(index: number) {
            return index;
        }

        @Emit("addIngredient")
        public addIngredient() {}
    }
</script>