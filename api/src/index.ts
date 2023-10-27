import "reflect-metadata";
import { container } from "tsyringe";
import mongoose from "mongoose";
import { DiStartup } from "./startup/di/DiRegistration";
import { ExpressStartup } from "./startup/ExpressStartup";
import {ILoggerFactory} from "./startup/LoggerFactory";
import Config from "./startup/config/Config";

(async () => {
    // DI init
    DiStartup.init(container);

    // logger init
    const loggerFactory = container.resolve<ILoggerFactory>("ILoggerFactory");
    const logger = loggerFactory.makeLogger(__filename);

    const app = ExpressStartup.init(logger);

    // Database connection
    try {
        await mongoose.connect(Config.MONGO_CONNECTION_STRING || "", {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch(error) {
        console.error("Connection error", error);
        process.exit(1);
    }

    app.listen(Config.API_PORT, () => {
        console.log(`Server is running on port ${Config.API_PORT}`);
    });
})();