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
                    <option v-for="unit in unitsList" :value="unit.value">{{ unit.label }}</option>
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
    import { Component, Vue, Prop, Emit } from "vue-facing-decorator";
    import type {IIngredientParams} from "@/components/params/IIngredientParams";

    @Component
    export default class IngredientsGrid extends Vue {
        @Prop({ default: () => [] })
        public readonly ingredients!: IIngredientParams[];

        @Prop({ default: () => [] })
        public readonly ingredientErrors!: string[];

        @Prop({default: false})
        public readonly loading!: boolean;

        public variant(msg?: string) {
            return msg ? "danger" : "";
        }

        @Emit("removeIngredient")
        public removeIngredient(index: number) {
            return index;
        }

        @Emit("addIngredient")
        public addIngredient() {}

        public unitsList: IUnit[] = [
            {label: "Teaspoons (tsp)", value: "tsp"},
            {label: "Tablespoons (Tbsp)", value: "Tbsp"},
            {label: "Fluid Ounces (fl oz)", value: "fl oz"},
            {label: "Cups (cup)", value: "cup"},
            {label: "Pints (pt)", value: "pt"},
            {label: "Quarts (qt)", value: "qt"},
            {label: "Gallons (gal)", value: "gal"},
            {label: "Milliliters (ml)", value: "ml"},
            {label: "Liters (l)", value: "l"},
            {label: "Grams (g)", value: "g"},
            {label: "Kilograms (kg)", value: "kg"},
            {label: "Ounces (oz)", value: "oz"},
            {label: "Pounds (lb)", value: "lb"},
            {label: "Pinches (pinch)", value: "pinch"},
            {label: "Dashes (dash)", value: "dash"},
            {label: "Touches (touch)", value: "touch"},
            {label: "Handfuls (handful)", value: "handful"},
            {label: "Sticks (stick)", value: "stick"},
            {label: "Cans (can)", value: "can"},
            {label: "Packages (pkg)", value: "pkg"},
            {label: "Jars (jar)", value: "jar"},
            {label: "Bottles (bottle)", value: "bottle"},
            {label: "Bunches (bunch)", value: "bunch"},
            {label: "Slices (slice)", value: "slice"},
            {label: "Pieces (piece)", value: "piece"},
            {label: "Wholes (whole)", value: "whole"},
            {label: "Halves (half)", value: "half"},
            {label: "Quarters (quarter)", value: "quarter"},
            {label: "Drops (drop)", value: "drop"},
            {label: "Cubes (cube)", value: "cube"}
        ];
    }

    interface IUnit {
        label: string;
        value: string;
    }
</script>