import {Body, Controller, Request, Delete, Get, Path, Post, Put, Query, Route, Security, Tags, UploadedFile} from "tsoa";
import {IRecipeRepository} from "../infra/IRecipeRepository";
import {IRecipe} from "../infra/IRecipe";
import {inject, injectable} from "tsyringe";
import {IPagedList} from "../infra/IPagedList";
import Tesseract, {OEM, PSM} from "tesseract.js";
import {NotFoundError, PermissionError, ValidationError} from "../infra/error-handling/HttpErrors";
import sharp from "sharp";
import {IRecipeToJsonConverter} from "../services/IRecipeToJsonConverter";
import {IUpdateRecipe} from "../infra/IUpdateRecipe";
import {IPrincipal} from "../startup/auth/IPrincipal";
import {IGroupRepository} from "../infra/IGroupRepository";
import {IUserRepository} from "../infra/IUserRepository";
import {IRecipeStats} from "../infra/IRecipeStats";

@injectable()
@Route("recipes")
@Security("Bearer")
@Tags("Recipes")
export class RecipeController extends Controller {
    constructor(
        @inject("IRecipeRepository") private recipeRepository: IRecipeRepository,
        @inject("IRecipeToJsonConverter") private recipeToJsonConverter: IRecipeToJsonConverter,
        @inject("IGroupRepository") private groupRepository: IGroupRepository,
        @inject("IUserRepository") private userRepository: IUserRepository
    ) {
        super();
    }

    @Get()
    public async getRecipes(
        @Request() request: { user: IPrincipal; },
        @Query() pageIndex: number = 0,
        @Query() pageSize: number = 10
    ): Promise<IPagedList<IRecipe>> {
        return this.recipeRepository.getAll(request.user.subId, pageIndex, pageSize);
    }

    @Get("stats")
    public async getStats(
        @Request() request: { user: IPrincipal; }
    ): Promise<IRecipeStats> {
        return this.recipeRepository.getStats(request.user.subId);
    }

    @Get("{id}")
    public async getRecipe(@Request() request: { user: IPrincipal; }, @Path() id: string): Promise<IRecipe | null> {
        const recipe = await this.recipeRepository.getById(id);
        if (recipe?.createdBy !== request.user.subId &&
            !(await this.groupRepository.isMember(request.user.subId, "default", recipe?.createdBy || ""))) {
            throw new NotFoundError(`Recipe with ID ${id} is not found or is not accessible.`);
        } else {
            if (recipe) {
                recipe.owningUser = {
                    name: (await this.userRepository.getBySubId(recipe?.createdBy))?.name || ""
                }
            }
            return recipe;
        }
    }

    @Post()
    public async createRecipe(@Request() request: { user: IPrincipal; }, @Body() recipe: IUpdateRecipe): Promise<IRecipe> {
        return this.recipeRepository.create(request.user.subId, recipe);
    }

    @Put("{id}")
    public async updateRecipe(@Request() request: { user: IPrincipal; }, @Path() id: string, @Body() updatedRecipe: IUpdateRecipe): Promise<IRecipe | null> {
        const recipe = await this.recipeRepository.getById(id);
        if (recipe?.createdBy !== request.user.subId) {
            throw new PermissionError(`Recipe with ID ${id} does not belong to you, so you cannot edit it.`);
        }
        return this.recipeRepository.update(request.user.subId, id, updatedRecipe);
    }

    @Delete("{id}")
    public async deleteRecipe(@Request() request: { user: IPrincipal; }, @Path() id: string): Promise<boolean> {
        const recipe = await this.recipeRepository.getById(id);
        if (recipe?.createdBy !== request.user.subId) {
            throw new PermissionError(`Recipe with ID ${id} does not belong to you, so you cannot delete it.`);
        }
        return this.recipeRepository.delete(id);
    }

    @Post("parse-text")
    public async parseText(@Body() parseTextRequest: ITextParseRequest) {
        return await this.recipeToJsonConverter.parseRecipe("text", parseTextRequest.source);
    }

    @Post("parse-image")
    public async parseImage(@UploadedFile("image") image: IImageParseRequest): Promise<string> {
        if (!image) {
            throw new ValidationError("image", "No image uploaded", "Recipe.ParseImage.NoImage");
        }

        const improvedImage = await this.preprocess(image.buffer);

        const worker = await Tesseract.createWorker("eng", OEM.LSTM_ONLY, {
            logger: (m) => console.log(m)
        });
        await worker.setParameters({
            tessedit_pageseg_mode: PSM.SINGLE_BLOCK
        });
        const result = await worker.recognize(improvedImage,{rotateAuto: true});
        console.log(`confidence: ${result.data.confidence}`)
        result.data.text.split("\n").forEach(l => console.log(l))
        return result.data.text;
    }

    private async preprocess(buffer: Buffer): Promise<Buffer> {
        return await sharp(buffer)
            .greyscale()
            .modulate({brightness: 1.3, saturation: 0})
            .median(2)
            .sharpen()
            .rotate()
            .toBuffer();
    }
}

interface IImageParseRequest {
    buffer: Buffer;
    mimetype: string;
    originalName: string;
}

interface ITextParseRequest {
    source: string
}
