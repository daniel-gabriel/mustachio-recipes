import {UnitsEnum} from "./UnitsEnum";

export interface IIngredient {
    item: string;
    quantity: number | null;
    unit: UnitsEnum;
}
