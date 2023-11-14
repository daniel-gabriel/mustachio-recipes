import {IIngredient} from "./IIngredient";
import {IStep} from "./IStep";
import {IMediaUrl} from "./IMediaUrl";
import {IAuditDates} from "./IAuditDates";
import {LocalesEnum} from "./LocalesEnum";

export interface IRecipe extends IAuditDates{
    id: string;
    locale: LocalesEnum;
    name: string;
    /**
     * The source of the recipe, like a URL from where it was imported
     */
    source?: string;
    description: string;
    /**
     * Additional notes about the recipe, like "put only half of the sugar" or "skip the chili pepper if children are eating"
     */
    additionalNotes?: string;
    ingredients: IIngredient[];
    steps: IStep[];
    mediaUrls: IMediaUrl[];
    createdBy: string;
    owningUser?: {name: string};
    createdOn: Date;
    lastUpdatedOn: Date;
}