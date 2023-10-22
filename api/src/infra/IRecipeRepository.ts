import { IRecipe } from './IRecipe';
import {IPagedList} from "./IPagedList";

export interface IRecipeRepository {
    getAll(pageIndex: number, pageSize: number): Promise<IPagedList<IRecipe>>;
    getById(id: string): Promise<IRecipe | null>;
    create(recipe: IRecipe): Promise<IRecipe>;
    update(id: string, updatedRecipe: IRecipe): Promise<IRecipe | null>;
    delete(id: string): Promise<boolean>;
}