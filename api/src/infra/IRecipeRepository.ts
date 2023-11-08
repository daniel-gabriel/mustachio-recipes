import { IRecipe } from './IRecipe';
import {IPagedList} from "./IPagedList";
import {IUpdateRecipe} from "./IUpdateRecipe";

export interface IRecipeRepository {
    getAll(userSubId: string, pageIndex: number, pageSize: number): Promise<IPagedList<IRecipe>>;
    getById(id: string): Promise<IRecipe | null>;
    create(userSubId: string, recipe: IUpdateRecipe): Promise<IRecipe>;
    update(userSubId: string, id: string, updatedRecipe: IUpdateRecipe): Promise<IRecipe | null>;
    delete(id: string): Promise<boolean>;
}