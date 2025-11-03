import {DependencyContainer, instanceCachingFactory} from "tsyringe";
import {IRecipeRepository} from "../../infra/IRecipeRepository";
import {MongoRecipeRepository} from "../../infra/MongoRecipeRepository";
import {RecipeController} from "../../controllers/RecipeController";
import {ILoggerFactory, LoggerFactory} from "../LoggerFactory";
import {IRecipeToJsonConverter} from "../../services/IRecipeToJsonConverter";
import {OpenAIRecipeToJsonConverter} from "../../services/OpenAIRecipeToJsonConverter";
import Config from "../config/Config";
import OpenAI from "openai";
import {IGroupRepository} from "../../infra/IGroupRepository";
import {MongoGroupRepository} from "../../infra/MongoGroupRepository";
import {IUserRepository} from "../../infra/IUserRepository";
import {MongoUserRepository} from "../../infra/MongoUserRepository";
import {FirebaseAuthMiddleware} from "../../middleware/FirebaseAuthMiddleware";

export class DiStartup {
    public static init(container: DependencyContainer) {
        container.register<OpenAI>("OpenAI", {
            useValue: new OpenAI({
                apiKey: Config.OPENAI_API_KEY,
                baseURL: Config.LLM_PROVIDER_URL
            })
        });
        container.register<ILoggerFactory>("ILoggerFactory", {useClass: LoggerFactory});
        container.register<IRecipeRepository>("IRecipeRepository", {useClass: MongoRecipeRepository});
        container.register<IGroupRepository>("IGroupRepository", {useClass: MongoGroupRepository});
        container.register<IUserRepository>("IUserRepository", {useClass: MongoUserRepository});
        container.register<IRecipeToJsonConverter>("IRecipeToJsonConverter", {useClass: OpenAIRecipeToJsonConverter});
        container.register<FirebaseAuthMiddleware>("FirebaseAuthMiddleware", {
            useFactory: instanceCachingFactory((c: DependencyContainer) =>
                new FirebaseAuthMiddleware("firebase-adminsdk-auth-key.json", c.resolve<IUserRepository>("IUserRepository")))
        });

        // controllers
        container.register<RecipeController>(RecipeController, {useClass: RecipeController});
    }
}