import {UnitsEnum} from "@/api";

export interface IIngredientParams {
    item?: string;
    quantity?: string;
    unit?: UnitsEnum;
}