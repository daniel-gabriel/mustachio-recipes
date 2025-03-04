/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IIngredient } from './IIngredient';
import type { IMediaUrl } from './IMediaUrl';
import type { IStep } from './IStep';
import type { LocalesEnum } from './LocalesEnum';

export type IRecipe = {
    /**
     * The date when the entity was created.
     */
    createdOn: string;
    /**
     * The date when the entity was updated.
     */
    lastUpdatedOn: string;
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
    ingredients: Array<IIngredient>;
    /**
     * List of instruction steps.
     */
    steps: Array<IStep>;
    mediaUrls: Array<IMediaUrl>;
    createdBy: string;
    owningUser?: {
name: string;
};
};
