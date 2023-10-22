import type {IMediaUrlParams} from "./IMediaUrlParams";
import type {IStepParams} from "./IStepParams";
import type {IIngredientParams} from "./IIngredientParams";

export interface IRecipeUpdateParams {
    name: string;
    source?: string;
    additionalNotes?: string;
    description: string;
    ingredients: IIngredientParams[];
    steps: IStepParams[];
    mediaUrls: IMediaUrlParams[];
}

