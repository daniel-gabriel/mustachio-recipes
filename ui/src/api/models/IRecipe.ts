/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IIngredient } from './IIngredient';
import type { IMediaUrl } from './IMediaUrl';
import type { IStep } from './IStep';

export type IRecipe = {
    id: string;
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
    ingredients: Array<IIngredient>;
    steps: Array<IStep>;
    mediaUrls: Array<IMediaUrl>;
};
