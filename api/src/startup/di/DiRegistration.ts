import {DependencyContainer} from "tsyringe";
import { IRecipeRepository } from "../../infra/IRecipeRepository";
import { MongoRecipeRepository } from "../../infra/MongoRecipeRepository";
import { RecipeController } from "../../controllers/RecipeController";
import {ILoggerFactory, LoggerFactory} from "../LoggerFactory";
import {IRecipeToJsonConverter} from "../../services/IRecipeToJsonConverter";
import {OpenAIRecipeToJsonConverter} from "../../services/OpenAIRecipeToJsonConverter";
import Keys from "../config/Keys";
import OpenAI from "openai";

export class DiStartup {
    public static init(container: DependencyContainer) {
        container.register<OpenAI>("OpenAI", {
            useValue: new OpenAI({
                apiKey: Keys.OPENAI_API_KEY
            })
        });
        container.register<ILoggerFactory>("ILoggerFactory", {useClass: LoggerFactory});
        container.register<IRecipeRepository>("IRecipeRepository", {useClass: MongoRecipeRepository});
        container.register<IRecipeToJsonConverter>("IRecipeToJsonConverter", {useClass: OpenAIRecipeToJsonConverter});

        // controllers
        container.register<RecipeController>(RecipeController, {useClass: RecipeController});
    }
}