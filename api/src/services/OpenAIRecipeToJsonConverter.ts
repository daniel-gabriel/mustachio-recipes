import {IRecipeToJsonConverter} from './IRecipeToJsonConverter';
import {ILogger, ILoggerFactory} from "../startup/LoggerFactory";
import {IRecipe} from "../infra/IRecipe";
import {IStep} from "../infra/IStep";
import {IIngredient} from "../infra/IIngredient";
import {IMediaUrl} from "../infra/IMediaUrl";
import {inject, injectable} from "tsyringe";
import OpenAI from "openai";

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

    private makePrompt(source: "html" | "text", data: string) {
        return `Parse the directions, ingredients, and images from this ${source} into a JSON object shaped like
            {
                description:  string,
                name: string,
                steps: [{instructions:  string }],
                mediaUrls: [{type: "image" | "video", url: string}],
                ingredients: [{item:  string, quantity: number, unit: string}]
            }
            leaving the collections empty if data cannot be extracted, using singular form for units, and returning
            only the JSON object in the response:
            ${data}`;

    }

    private responseToRecipe(text: string): IRecipe {
        console.log("-------------------");
        console.log(text);
        console.log("-------------------");

        const responseJson = JSON.parse(text.replace("\n", " ").replace("\r", " "));

        const convertSteps = (steps: unknown[] | undefined): IStep[] => {
            return steps?.map(s => ({
                instructions: (s as IStep)?.instructions || ""
            })) || [];
        }

        const convertIngredients = (ingredients: unknown[] | undefined): IIngredient[] => {
            return ingredients?.map(i => {
                const ing: IIngredient | undefined = i as IIngredient;
                return {
                    item: ing?.item || "",
                    unit: ing?.unit || (ing?.item ? "whole" : ""),
                    quantity: ing?.quantity || 0
                };
            }) || [];
        }

        const convertMediaUrls = (mediaUrls: unknown[] | undefined): IMediaUrl[] => {
            return mediaUrls?.map(mu => {
                const urlInfo: IMediaUrl | undefined = mu as IMediaUrl;
                return {
                    url: urlInfo?.url || "",
                    type: urlInfo?.type || "image"
                };
            }) || [];
        }

        return {
            id: "",
            name: (responseJson.name as string) || "",
            description: (responseJson.description as string) || "",
            steps: convertSteps(responseJson.steps as []),
            mediaUrls: convertMediaUrls(responseJson.mediaUrls),
            ingredients: convertIngredients(responseJson.ingredients as IIngredient[]),
            lastUpdatedOn: new Date(),
            createdOn: new Date()
        }
    }
}
