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

    /**
     * Searches and returns recipes that belong to the logged-in user, as well as their friends - users listed in the
     * logged-in user's "default" group, sorted by created date in descending order.
     * @param request Contains the logged-in user's principal.
     * @param pageIndex The 0-based index of the page to return. Default is 0.
     * @param pageSize The size of the page. Default is 10.
     */
    @Get()
    public async getRecipes(
        @Request() request: { user: IPrincipal; },
        @Query() pageIndex: number = 0,
        @Query() pageSize: number = 10
    ): Promise<IPagedList<IRecipe>> {
        return this.recipeRepository.getAll(request.user.subId, pageIndex, pageSize);
    }

    /**
     * Returns the logged-in user's statistics - how many recipes belong to the user and how many belong to the user's
     * friends.
     * @param request Contains the logged-in user's principal.
     * */
    @Get("stats")
    public async getStats(
        @Request() request: { user: IPrincipal; }
    ): Promise<IRecipeStats> {
        return this.recipeRepository.getStats(request.user.subId);
    }

    /**
     * Returns the recipe specified by the `id`. If the recipe doesn't belong to the logged-in user or their friends,
     * a 404 Not Found is returned to not expose the fact of the existence of the requested recipe.
     * @param request Contains the logged-in user's principal.
     * @param id The id of the recipe to retrieve.
     */
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

    /**
     * Creates a new recipe with the logged-in user set as the owner. If any of the recipe's parameters are not valid,
     * a 400 Bad Request is returned, with the error information in the format of Problem-Json
     * (https://datatracker.ietf.org/doc/html/rfc7807).
     * @param request Contains the logged-in user's principal.
     * @param recipe The recipe to create.
     */
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

    /**
     * Updates an existing recipe specified by the `id`. If any of the recipe's parameters are not valid,
     * a 400 Bad Request is returned, with the error information in the format of Problem-Json
     * (https://datatracker.ietf.org/doc/html/rfc7807). If the recipe doesn't belong to the logged-in user, a 403 Forbidden
     * is returned.
     * @param request Contains the logged-in user's principal.
     * @param id The id of the recipe to update.
     * @param updatedRecipe The updated recipe.
     */
    @Put("{id}")
    public async updateRecipe(@Request() request: { user: IPrincipal; }, @Path() id: string, @Body() updatedRecipe: IUpdateRecipe): Promise<IRecipe | null> {
        const recipe = await this.recipeRepository.getById(id);
        if (recipe?.createdBy !== request.user.subId) {
            throw new PermissionError(`Recipe with ID ${id} does not belong to you, so you cannot edit it.`);
        }
        this.validateRecipe(updatedRecipe);
        return this.recipeRepository.update(request.user.subId, id, updatedRecipe);
    }

    /**
     * Deletes an existing recipe specified by the `id`. If the recipe doesn't belong to the logged-in user, a 403 Forbidden
     * is returned.
     * @param request Contains the logged-in user's principal.
     * @param id The id of the recipe to update.
     */
    @Delete("{id}")
    public async deleteRecipe(@Request() request: { user: IPrincipal; }, @Path() id: string): Promise<boolean> {
        const recipe = await this.recipeRepository.getById(id);
        if (recipe?.createdBy !== request.user.subId) {
            throw new PermissionError(`Recipe with ID ${id} does not belong to you, so you cannot delete it.`);
        }
        return this.recipeRepository.delete(id);
    }

    /**
     * Parses the specified recipe text using artificial intelligence, and returns as much information as could be
     * extracted from the text.
     * @param parseTextRequest The text parameters to parse.
     */
    @Post("parse-text")
    public async parseText(@Body() parseTextRequest: ITextParseRequest) {
        return await this.recipeToJsonConverter.parseRecipe("text", parseTextRequest.source);
    }

    /**
     * Parses the specified recipe image using OCR and artificial intelligence, and returns as much information as could be
     * extracted from the text.
     * @param image The parameters of the image containing text to parse.
     */
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

/**
 * Parameters of parsing the image.
 */
interface IImageParseRequest {
    /**
     * The image to parse.
     */
    buffer: Buffer;
    /**
     * The mime type of the image.
     */
    mimetype: string;
    /**
     * The original name of the image file - this is used for display purposes.
     */
    originalName: string;
}

/**
 * Parameters of parsing the text.
 */
interface ITextParseRequest {
    /**
     * The text to parse.
     */
    source: string
}
