import { IRecipeDoc, IRecipeModel, RecipeModel } from "./RecipeModel";
import { IRecipe } from "./IRecipe";
import { IRecipeRepository } from "./IRecipeRepository";
import { IIngredient } from "./IIngredient";
import {IStep} from "./IStep";
import {IPagedList} from "./IPagedList";
import {IUpdateRecipe} from "./IUpdateRecipe";
import {GroupModel, IGroupModel, IMemberModel} from "./GroupModel";
import {nameof} from "../utils/Helpers";

export class MongoRecipeRepository implements IRecipeRepository {

    public async getAll(userSubId: string, pageIndex: number = 0, pageSize: number = 10): Promise<IPagedList<IRecipe>> {
        // validate paging
        if (pageIndex < 0) {
            throw new Error("Page index must be 0 or greater");
        }
        if (pageSize > 100 || pageSize < 1) {
            throw new Error("Page size must be between 1 and 100");
        }
        const skipCount = pageIndex * pageSize;

        const memberSubIds = await this.getGroupMembers(userSubId);
        const matchOptions = {
            $match: {
                $or: [
                    { [nameof<IRecipeModel>("createdBy")]: userSubId },
                    { [nameof<IRecipeModel>("createdBy")]: { $in: memberSubIds } }
                ]
            }
        };
        const sortOptions = {
            $sort: { [nameof<IRecipeModel>("lastUpdatedOn")]: -1 } as Record<string, 1|-1>
        };
        const pagingOptions = [{ $skip: skipCount }, { $limit: pageSize }];

        const pipeline = [{
            $facet: {
                pagedResults: [matchOptions, sortOptions, ...pagingOptions],
                totalCount: [matchOptions, { $count: "count" }]
            }
        }];
        const result = (await RecipeModel.aggregate(pipeline).exec())?.[0];

        // get the data and count results
        const recipes = result.pagedResults as IRecipeDoc[];
        const totalItems = result.totalCount?.[0]?.count || 0;

        // Return the paged result
        return {
            data: recipes.map(r => this.toExternalModel(r)) as IRecipe[],
            pageIndex,
            pageSize,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize)
        };
    }

    public async getById(id: string): Promise<IRecipe | null> {
        const recipe: IRecipeDoc | null = await RecipeModel.findById(id).exec();
        if (!recipe) {
            return null;
        }
        return this.toExternalModel(recipe);
    }

    public async create(userSubId: string, recipe: IUpdateRecipe): Promise<IRecipe> {
        const newRecipe = new RecipeModel(<IRecipeModel> {
            createdBy: userSubId,
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

    public async update(userSubId: string, id: string, updatedRecipe: IUpdateRecipe): Promise<IRecipe | null> {
        const recipe: IRecipeDoc | null = await RecipeModel.findByIdAndUpdate(id,
            this.toDbModel(userSubId, updatedRecipe),
            { new: true }
        ).exec();
        if (!recipe) {
            return null;
        }
        return this.toExternalModel(recipe);
    }

    public async delete(id: string): Promise<boolean> {
        const result = await RecipeModel.findByIdAndDelete(id).exec();
        return !!result;
    }

    private async getGroupMembers(userSubId: string): Promise<string[]> {
        const groupName = "default";
        const memberSubIdPropertyName: string = `${nameof<IGroupModel>("members")}.${nameof<IMemberModel>("subId")}`;

        const groupMembers = await GroupModel
            .findOne({owner: userSubId, name: groupName}, {[memberSubIdPropertyName]: 1})
            .lean();
        return groupMembers?.members.map(m => m.subId) || [];
    }

    private toExternalModel(recipe: IRecipeDoc): IRecipe {
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
            createdBy: recipe.createdBy,
            createdOn: recipe.createdOn,
            lastUpdatedOn: recipe.lastUpdatedOn
        }
    }

    private toDbModel(createdBy: string, recipe: IUpdateRecipe): IRecipeModel {
        return {
            createdBy,
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
            // these 2 dates are set here, but they are ignored during saving since they are automatically set by mongoose
            createdOn: new Date(),
            lastUpdatedOn: new Date()
        }
    }
}