import {Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Tags, UploadedFile} from "tsoa";
import {IRecipeRepository} from "../infra/IRecipeRepository";
import {IRecipe} from "../infra/IRecipe";
import {inject, injectable} from "tsyringe";
import {IPagedList} from "../infra/IPagedList";
import Tesseract, {OEM, PSM} from "tesseract.js";
import {ValidationError} from "../infra/error-handling/HttpErrors";
import sharp from "sharp";
import {IRecipeToJsonConverter} from "../services/IRecipeToJsonConverter";
import {IUpdateRecipe} from "../infra/IUpdateRecipe";

@injectable()
@Route("recipes")
@Tags("Recipes")
export class RecipeController extends Controller {
    constructor(
        @inject("IRecipeRepository") private recipeRepository: IRecipeRepository,
        @inject("IRecipeToJsonConverter") private recipeToJsonConverter: IRecipeToJsonConverter
    ) {
        super();
    }

    @Get()
    public async getRecipes(
        @Query() pageIndex: number = 0,
        @Query() pageSize: number = 10
    ): Promise<IPagedList<IRecipe>> {
        return this.recipeRepository.getAll(pageIndex, pageSize);
    }

    @Get("{id}")
    public async getRecipe(@Path() id: string): Promise<IRecipe | null> {
        return this.recipeRepository.getById(id);
    }

    @Post()
    public async createRecipe(@Body() recipe: IUpdateRecipe): Promise<IRecipe> {
        return this.recipeRepository.create(recipe);
    }

    @Put("{id}")
    public async updateRecipe(@Path() id: string, @Body() updatedRecipe: IUpdateRecipe): Promise<IRecipe | null> {
        return this.recipeRepository.update(id, updatedRecipe);
    }

    @Delete("{id}")
    public async deleteRecipe(@Path() id: string): Promise<boolean> {
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
    originalname: string;
}

interface ITextParseRequest {
    source: string
}
