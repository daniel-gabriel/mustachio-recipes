import {IRecipeToJsonConverter} from "./IRecipeToJsonConverter";
import {ILogger, ILoggerFactory} from "../startup/LoggerFactory";
import {IRecipe} from "../infra/IRecipe";
import {IStep} from "../infra/IStep";
import {IIngredient} from "../infra/IIngredient";
import {IMediaUrl} from "../infra/IMediaUrl";
import {inject, injectable} from "tsyringe";
import OpenAI from "openai";
import {LocalesEnum} from "../infra/LocalesEnum";
import {UnitsEnum} from "../infra/UnitsEnum";

@injectable()
export class OpenAIRecipeToJsonConverter implements IRecipeToJsonConverter {
    private readonly logger: ILogger;

    constructor(
        @inject("ILoggerFactory") loggerFactory: ILoggerFactory,
        @inject("OpenAI") private openAI: OpenAI) {
        this.logger = loggerFactory.makeLogger(__filename);
    }

    public async parseRecipe(type: "html" | "text", textOrHtml: string): Promise<IRecipe> {

        try {
            const responseData = await this.openAI.chat.completions.create({
                model: "gpt-4",
                max_tokens: 1000,
                messages: [{
                    role: "user",
                    content: this.makePrompt(type, textOrHtml)
                }]
            });
            return this.responseToRecipe(responseData.choices[0].message.content?.trim() || "");
        } catch (error) {
            this.logger.error(error as Error, "Error calling the OpenAI API");
            throw new Error("Could not extract recipe data");
        }
    }

    private makePrompt(sourceType: "html" | "text", data: string) {
        const unitList: string[] = Object.values(UnitsEnum);
        const localeList: string[] = Object.values(LocalesEnum);
        return `Parse the directions, ingredients, and images from this ${sourceType} into a JSON object shaped like
            {
                recipeLocale: string, //${JSON.stringify(localeList)}
                description:  string,
                name: string,
                steps: [{instructions:  string }],
                mediaUrls: [{type: "image" | "video", url: string}],
                ingredients: [{item:  string, quantity: number|null, unitAbbreviationInEnglish: string}]
            }
            leaving the collections empty if data cannot be extracted, using singular form for units, only using units
            from this list: ${JSON.stringify(unitList)}, leaving
            the rest of the recipe in its original language and returning only the JSON object in the response:
            ${data}`;

    }

    private responseToRecipe(text: string): IRecipe {
        console.log("-------------------");
        console.log(text);
        console.log("-------------------");

        const responseJson =
            JSON.parse(text.replace("\n", " ").replace("\r", " ")) as IParsedRecipe;

        const convertSteps = (steps: unknown[] | undefined): IStep[] => {
            return steps?.map(s => ({
                instructions: (s as IStep)?.instructions || ""
            })) || [];
        };

        const convertIngredients = (ingredients: (IParsedIngredient | undefined)[] | undefined): IIngredient[] => {
            return ingredients?.map(i => {
                return {
                    item: i?.item || "",
                    unit: i?.unitAbbreviationInEnglish || (i?.item ? "whole" : ""),
                    quantity: i?.quantity || null
                } as IIngredient;
            }) || [];
        };

        const convertMediaUrls = (mediaUrls: unknown[] | undefined): IMediaUrl[] => {
            return mediaUrls?.map(mu => {
                const urlInfo: IMediaUrl | undefined = mu as IMediaUrl;
                return {
                    url: urlInfo?.url || "",
                    type: urlInfo?.type || "image"
                };
            }) || [];
        };

        const locale = (
            responseJson.recipeLocale && Object.values(LocalesEnum).includes(responseJson.recipeLocale as LocalesEnum)
        ) ?
            responseJson.recipeLocale as LocalesEnum : LocalesEnum.unsupported;

        return {
            id: "",
            locale,
            name: (responseJson.name as string) || "",
            description: (responseJson.description as string) || "",
            steps: convertSteps(responseJson.steps as []),
            mediaUrls: convertMediaUrls(responseJson.mediaUrls),
            ingredients: convertIngredients(responseJson.ingredients as IParsedIngredient[]),
            createdBy: "",
            lastUpdatedOn: new Date(),
            createdOn: new Date()
        };
    }
}

interface IParsedIngredient {
    item: string;
    quantity: number | null;
    unitAbbreviationInEnglish: string;
}

interface IParsedMediaUrl {
    type: "image" | "video",
    url: string
}

interface IParsedStep {
    instructions?: string;
}

interface IParsedRecipe {
    recipeLocale?: string, //BCP 47 but only ru-RU, en-US are supported
    description?:  string,
    name?: string,
    steps?: IParsedStep[],
    mediaUrls?: IParsedMediaUrl[],
    ingredients?: IParsedIngredient[]
}