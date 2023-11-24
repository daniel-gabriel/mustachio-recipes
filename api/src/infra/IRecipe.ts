import {IIngredient} from "./IIngredient";
import {IStep} from "./IStep";
import {IMediaUrl} from "./IMediaUrl";
import {IAuditDates} from "./IAuditDates";
import {LocalesEnum} from "./LocalesEnum";

export interface IRecipe extends IAuditDates {
    /**
     * The ID of the recipe.
     */
    id: string;
    /**
     * The locale of the recipe. Currently only "en-US" and "ru-RU" are supported.
     */
    locale: LocalesEnum;
    /**
     * The name of the recipe.
     */
    name: string;
    /**
     * The source of the recipe, like a URL from where it was imported.
     */
    source?: string;
    /**
     * The description of the recipe.
     */
    description: string;
    /**
     * Additional notes about the recipe, like "put only half of the sugar" or "skip the chili pepper if children are eating".
     */
    additionalNotes?: string;
    /**
     * List of ingredients.
     */
    ingredients: IIngredient[];
    /**
     * List of instruction steps.
     */
    steps: IStep[];
    mediaUrls: IMediaUrl[];
    createdBy: string;
    owningUser?: {name: string};
    createdOn: Date;
    lastUpdatedOn: Date;
}