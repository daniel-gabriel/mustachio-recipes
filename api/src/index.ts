import "reflect-metadata";
import { container } from "tsyringe";
import mongoose from "mongoose";
import { DiStartup } from "./startup/di/DiRegistration";
import { ExpressStartup } from "./startup/ExpressStartup";
import {ILoggerFactory} from "./startup/LoggerFactory";
import Keys from "./startup/config/Keys";

(async () => {
    // DI init
    DiStartup.init(container);

    // logger init
    const loggerFactory = container.resolve<ILoggerFactory>("ILoggerFactory");
    const logger = loggerFactory.makeLogger(__filename);

    const app = ExpressStartup.init(logger);

    // Database connection
    try {
        await mongoose.connect("mongodb://mongodb:27017/recipeDB", {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch(error) {
        console.error("Connection error", error);
        process.exit(1);
    }

    app.listen(Keys.PORT, () => {
        console.log(`Server is running on port ${Keys.PORT}`);
    });
})();