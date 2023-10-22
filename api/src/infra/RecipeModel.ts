import { Document, model } from "mongoose";
import {IAuditDates} from "./IAuditDates";
import DbHelper from "./DbHelper";
import {IIngredient} from "./IIngredient";
import {IStep} from "./IStep";
import {IMediaUrl} from "./IMediaUrl";

export interface IRecipeModel extends IAuditDates{
    name: string;
    description: string;
    source?: string;
    additionalNotes?: string;
    ingredients: [{
        item: string;
        quantity: number;
        unit: string;
    }];
    steps: [{
        instructions: string;
    }];
    mediaUrls: [{
        type: "image" | "video";
        displayName?: string;
        url: string;
    }];
}

export interface IRecipeDoc extends IRecipeModel, Document {}

const ingredientSchema = DbHelper.MakeSchema<IIngredient>({
    item: String,
    quantity: Number,
    unit: String
});

const stepSchema = DbHelper.MakeSchema<IStep>({
    instructions: String
});

const mediaUrlSchema = DbHelper.MakeSchema<IMediaUrl>({
    type: String,
    displayName: String,
    url: String
});

const recipeSchema = DbHelper.MakeSchema<IRecipeModel>({
    name: String,
    description: String,
    source: String,
    additionalNotes: String,
    ingredients: [ingredientSchema],
    steps: [stepSchema],
    mediaUrls: [mediaUrlSchema]
});

export const RecipeModel =  model<IRecipeDoc>("Recipe", recipeSchema);