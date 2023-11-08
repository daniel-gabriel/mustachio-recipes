import { Document, model } from "mongoose";
import {IAuditDates} from "./IAuditDates";
import DbHelper from "./DbHelper";

export interface IRecipeModel extends IAuditDates {
    createdBy: string;
    name: string;
    description: string;
    source?: string;
    additionalNotes?: string;
    ingredients: IIngredientModel[];
    steps: IStepModel[];
    mediaUrls: IMediaUrlModel[];
}

interface IIngredientModel {
    item: string;
    quantity: number;
    unit: string;
}

interface IStepModel {
    instructions: string;
}

interface IMediaUrlModel {
    type: "image" | "video";
    displayName?: string;
    url: string;
}

export interface IRecipeDoc extends IRecipeModel, Document {}

const ingredientSchema = DbHelper.MakeSchema<IIngredientModel>({
    item: String,
    quantity: Number,
    unit: String
});

const stepSchema = DbHelper.MakeSchema<IStepModel>({
    instructions: String
});

const mediaUrlSchema = DbHelper.MakeSchema<IMediaUrlModel>({
    type: String,
    displayName: String,
    url: String
});

const recipeSchema = DbHelper.MakeSchema<IRecipeModel>({
    createdBy: String,
    name: String,
    description: String,
    source: String,
    additionalNotes: String,
    ingredients: [ingredientSchema],
    steps: [stepSchema],
    mediaUrls: [mediaUrlSchema]
});

export const RecipeModel =  model<IRecipeDoc>("Recipe", recipeSchema);