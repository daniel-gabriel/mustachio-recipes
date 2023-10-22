import express from "express";
import * as swaggerUi from "swagger-ui-express";
import path from "path";
import { RegisterRoutes } from "../tsoa-generated/routes";
import * as cors from "cors";
import {ILogger} from "./LoggerFactory";
import {DefaultErrorToProblemJsonConverter} from "../infra/error-handling/DefaultErrorToProblemJsonConverter";

export class ExpressStartup {
    public static init(logger: ILogger) {
        // Express init
        const app = express();
        
        // Middlewares
        app.use(express.json({ limit: "16mb" }));
        app.use(express.urlencoded({ limit: "16mb", extended: true }));

        this.useCors(app);
        this.useSwagger(app);

        // Register TSOA routes
        RegisterRoutes(app);
        this.useErrorHandling(app, logger);

        return app;
    }

    private static useCors(app: express.Express): void {
        app.use(cors.default());
    }

    private static useSwagger(app: express.Express): void {
        app.get("/docs/v1/swagger.json", async (_req: express.Request, res: express.Response) =>
            res.json(await import("../tsoa-generated/swagger/v1/swagger.json")));
        const staticFolder = path.join(__dirname, "../../dist/tsoa-generated/swagger");
        console.log(`serving static files from: ${staticFolder}`);
        app.use("/docs", express.static(staticFolder));

        const options = <swaggerUi.SwaggerUiOptions> {
            customfavIcon: "/docs/assets/favicon.webp",
            customCssUrl: "/docs/css/theme-newspaper.css",
            customCss: ".swagger-ui .topbar { display: none }",
            swaggerOptions: {
                url: "/docs/v1/swagger.json",
                persistAuthorization: true,
                displayRequestDuration: true,
                docExpansion: "full"
            }
        };
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(undefined, options));
    }

    private static useErrorHandling(app: express.Express, logger: ILogger): void {
        const errorToJsonConverter = new DefaultErrorToProblemJsonConverter(logger);
        app.use((
            err: unknown,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ): void => errorToJsonConverter.sendErrorAsProblemJson(err as any, req, res, next));
    }
}