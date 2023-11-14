import { Document, model } from "mongoose";
import {IAuditDates} from "./IAuditDates";
import DbHelper from "./DbHelper";
import {LocalesEnum} from "./LocalesEnum";
import {UnitsEnum} from "./UnitsEnum";

export interface IRecipeModel extends IAuditDates {
    locale: LocalesEnum;
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
    quantity: number | null;
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
    quantity: {
        type: Number,
        default: null
    },
    unit: {
        type: String,
        enum: UnitsEnum
    }
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
    locale: {
        type: String,
        enum: Object.values(LocalesEnum)
    },
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