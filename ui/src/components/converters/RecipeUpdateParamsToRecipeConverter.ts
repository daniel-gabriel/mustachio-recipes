import type {IRecipeUpdateParams} from "@/components/params/IRecipeUpdateParams";
import {IMediaUrl, type IUpdateRecipe} from "@/api";
import {MediaUtils} from "@/utils/MediaUtils";
import type {IIngredientParams} from "@/components/params/IIngredientParams";
import type {IStepParams} from "@/components/params/IStepParams";
import type {IMediaUrlParams} from "@/components/params/IMediaUrlParams";
import {NumberUtils} from "@/utils/NumberUtils";

export class RecipeUpdateParamsToRecipeConverter {
    public static convert(recipeParams: IRecipeUpdateParams): IUpdateRecipe {
        return {
            name: recipeParams.name,
            source: recipeParams.source,
            additionalNotes: recipeParams.additionalNotes,
            description: recipeParams.description,
            ingredients: recipeParams.ingredients.map((i: IIngredientParams) => ({
                item: i.item || "",
                quantity: NumberUtils.toDecimal(i.quantity) || 0,
                unit: i.unit || ""
            })),
            steps: recipeParams.steps.map((s: IStepParams) => ({
                instructions: s.instructions || ""
            })),
            mediaUrls: recipeParams.mediaUrls.map((m: IMediaUrlParams) => {
                const type = MediaUtils.getUrlType(m.url || "") || "";
                return ({
                    url: m.url || "",
                    displayName: m.displayName,
                    type: ["image", "file"].includes(type) ?
                        IMediaUrl.type.IMAGE : type === "video" ?
                            IMediaUrl.type.VIDEO :
                            undefined
                });
            })
        };
    }
}