import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";

/**
 * Helps manage an in-memory instance of Mongo. Use
 * `await startInMemoryMongo()` in the `beforeEach`
 * or `beforeAll`. Call `await stopInMemoryMongo()`
 * in `afterAll` or `afterEach`
 */
export class MongoTestHelper {
    private connection?: mongoose.Connection = undefined;
    private mongoServer?: MongoMemoryServer = undefined;

    opts: mongoose.ConnectOptions = {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    }

    async startInMemoryMongo() {
        this.mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(this.mongoServer.getUri(), this.opts)
        this.connection = mongoose.connection
    }

    async stopInMemoryMongo() {
        await mongoose.disconnect()
        await this.mongoServer?.stop()
    }

    async clearDb() {
        for (const collection in (this.connection?.collections || [])) {
            await this.connection?.collections[collection].deleteOne({});
        }
    }
}