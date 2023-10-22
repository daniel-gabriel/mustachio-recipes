import { IRecipeDoc, IRecipeModel, RecipeModel } from "./RecipeModel";
import { IRecipe } from "./IRecipe";
import { IRecipeRepository } from "./IRecipeRepository";
import { IIngredient } from "./IIngredient";
import {IStep} from "./IStep";
import {IPagedList} from "./IPagedList";
import {nameof} from "../utils/Helpers";

export class MongoRecipeRepository implements IRecipeRepository {
    public async getAll(pageIndex: number = 0, pageSize: number = 10): Promise<IPagedList<IRecipe>> {
        if (pageIndex < 0) {
            throw new Error("Page index must be 0 or greater");
        }
        if (pageSize > 100 || pageSize < 1) {
            throw new Error("Page size must be between 1 and 100");
        }

        // Calculate the number of documents to skip
        const skipCount = pageIndex * pageSize;

        // Execute the query with skip and limit
        const recipes = await RecipeModel
            .find()
            .sort({ [nameof<IRecipeModel>("lastUpdatedOn")]: "desc" })
            .skip(skipCount)
            .limit(pageSize).exec() as IRecipeDoc[];

        // Get the total number of documents in the collection
        const totalItems = await RecipeModel.countDocuments().exec();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalItems / pageSize);

        // Return the paged result
        return {
            data: recipes.map(r => this.toExternalModel(r)) as IRecipe[],
            pageIndex,
            pageSize,
            totalItems,
            totalPages
        };
    }

    public async getById(id: string): Promise<IRecipe | null> {
        return this.toExternalModel(await RecipeModel.findById(id).exec());
    }

    public async create(recipe: IRecipe): Promise<IRecipe> {
        const newRecipe = new RecipeModel(<IRecipeModel> {
            description: recipe.description,
            name: recipe.name,
            source: recipe.source,
            additionalNotes: recipe.additionalNotes,
            steps: recipe.steps.map(s => (<IStep> {
                instructions: s.instructions
            })),
            mediaUrls: recipe.mediaUrls.map(u => ({
                type: u.type as ("image" | "video"),
                displayName: u.displayName,
                url: u.url
            })),
            ingredients: recipe.ingredients.map(i => (<IIngredient>{
                item: i.item,
                quantity: i.quantity,
                unit: i.unit
            })),
            createdOn: new Date(),
            lastUpdatedOn: new Date()
        });
        await newRecipe.save();
        return this.toExternalModel(newRecipe) as IRecipe;
    }

    public async update(id: string, updatedRecipe: IRecipe): Promise<IRecipe | null> {
        return this.toExternalModel(await RecipeModel.findByIdAndUpdate(id,
            {...updatedRecipe, lastUpdatedOn: new Date()},
            { new: true }
        ).exec());
    }

    public async delete(id: string): Promise<boolean> {
        const result = await RecipeModel.findByIdAndDelete(id).exec();
        return !!result;
    }

    private toExternalModel(recipe: IRecipeDoc | null): IRecipe | null {
        if (!recipe) {
            return null;
        }
        return {
            id: recipe._id.toString(),
            description: recipe.description,
            name: recipe.name,
            source: recipe.source,
            additionalNotes: recipe.additionalNotes,
            steps: recipe.steps.map(s => ({
                instructions: s.instructions
            })),
            mediaUrls: recipe.mediaUrls.map(u => ({
                type: u.type as ("image" | "video"),
                displayName: u.displayName,
                url: u.url
            })),
            ingredients: recipe.ingredients.map(i => (<IIngredient>{
                item: i.item,
                quantity: i.quantity,
                unit: i.unit
            })),
            createdOn: recipe.createdOn,
            lastUpdatedOn: recipe.lastUpdatedOn
        }
    }
}