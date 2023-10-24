import type {IRecipeUpdateParams} from "@/components/params/IRecipeUpdateParams";
import {type IIngredient, IMediaUrl, type IRecipe, type IStep} from "@/api";
import {NumberUtils} from "@/utils/NumberUtils";

export class RecipeToRecipeUpdateParamsConverter {
    public static convert(recipe?: IRecipe): IRecipeUpdateParams {
        return {
            name: recipe?.name || "",
            description: recipe?.description || "",
            source: recipe?.source,
            additionalNotes: recipe?.additionalNotes,
            steps: recipe?.steps.map((s: IStep) => s) || [],
            ingredients: recipe?.ingredients.map((i: IIngredient) => ({
                item: i.item,
                quantity: NumberUtils.toFraction(i.quantity),
                unit: i.unit
            })) || [],
            mediaUrls: recipe?.mediaUrls.map((m: IMediaUrl) => ({
                url: m.url,
                displayName: m.displayName,
                type: m.type
            })) || []
        };
    }
}