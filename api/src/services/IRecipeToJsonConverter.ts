import {IRecipe} from "../infra/IRecipe";

export interface IRecipeToJsonConverter {
    parseRecipe(type: "html" | "text", textOrHtml: string): Promise<IRecipe>;
}
