import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Query,
    Request,
    Route,
    Security,
    Tags,
    UploadedFile
} from "tsoa";
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
import {nameof} from "../utils/Helpers";
import {LocalesEnum} from "../infra/LocalesEnum";
import {UnitsEnum} from "../infra/UnitsEnum";
import {IIngredient} from "../infra/IIngredient";

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
        this.validateRecipe(recipe);

        return this.recipeRepository.create(request.user.subId, recipe);
    }

    private validateRecipe(recipe: IUpdateRecipe): void {
        if (!recipe.locale) {
            throw new ValidationError(nameof<IUpdateRecipe>("locale"),
                "Locale is required", "updateRecipe.localeEmpty");
        }
        const supportedLocales: string[] = Object.values(LocalesEnum);
        if (!supportedLocales.includes(recipe.locale)) {
            throw new ValidationError(nameof<IUpdateRecipe>("locale"),
                `Locale ${recipe.locale} is not supported. Only ${JSON.stringify(supportedLocales)} are supported.`,
                "updateRecipe.localeUnsupported");
        }
        if (!recipe.name) {
            throw new ValidationError(nameof<IUpdateRecipe>("name"),
                "Name is required", "updateRecipe.nameEmpty");
        }

        if (!recipe.description) {
            throw new ValidationError(nameof<IUpdateRecipe>("description"),
                "Description is required", "updateRecipe.descriptionEmpty");
        }

        if (!recipe.ingredients?.length) {
            throw new ValidationError(nameof<IUpdateRecipe>("ingredients"),
                "At least 1 ingredient is required", "updateRecipe.ingredientsEmpty");
        } else {
            recipe.ingredients.forEach((ing, i) => {
                if (!ing.item || !ing.unit) {
                    throw new ValidationError(
                        `${nameof<IUpdateRecipe>("ingredients")}[${i}]`,
                        "The name, valid quantity, and a unit of measure are required for each ingredient.",
                        `updateRecipe.ingredient[${i}].propEmpty`);
                }
                if (!Object.values(UnitsEnum).includes(ing.unit)) {
                    throw new ValidationError(
                        `${nameof<IUpdateRecipe>("ingredients")}[${i}].${nameof<IIngredient>("unit")}`,
                        `Units must be one of the following: ${JSON.stringify(UnitsEnum)}`,
                        `updateRecipe.ingredient[${i}].unitInvalid`);
                }
                if (ing.unit !== UnitsEnum.ToTaste && (ing.quantity === null || isNaN(ing.quantity))) {
                    throw new ValidationError(
                        `${nameof<IUpdateRecipe>("ingredients")}[${i}].${nameof<IIngredient>("quantity")}`,
                        "The quantity must be a number",
                        `updateRecipe.ingredient[${i}].quantityNotANumber`);
                }
            });
        }

        if (!recipe.steps?.length) {
            throw new ValidationError(nameof<IUpdateRecipe>("steps"),
                "At least 1 step is required",
                "updateRecipe.stepsEmpty");
        } else {
            recipe.steps.forEach((s, i) => {
                if (!s.instructions) {
                    throw new ValidationError(`${nameof<IUpdateRecipe>("name")}[${i}]`,
                        "Every instruction step is required to have some text.",
                        `updateRecipe.steps[${i}].stepEmpty`);
                }
            });
        }

        recipe.mediaUrls?.forEach((s, i) => {
            if (!s.url) {
                throw new ValidationError(`${nameof<IUpdateRecipe>("name")}[${i}]`,
                    "Every image or video is required to have an image or video URL, or be an attached file.",
                    `updateRecipe.mediaUrls[${i}].urlEmpty`);
            }
        });
    }

    @Put("{id}")
    public async updateRecipe(@Request() request: { user: IPrincipal; }, @Path() id: string, @Body() updatedRecipe: IUpdateRecipe): Promise<IRecipe | null> {
        const recipe = await this.recipeRepository.getById(id);
        if (recipe?.createdBy !== request.user.subId) {
            throw new PermissionError(`Recipe with ID ${id} does not belong to you, so you cannot edit it.`);
        }
        this.validateRecipe(updatedRecipe);
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
