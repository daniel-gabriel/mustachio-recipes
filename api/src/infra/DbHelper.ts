import {Schema, SchemaOptions} from "mongoose";
import {IAuditDatesModel} from "./IAuditDatesModel";

export default class DbHelper {

    /**
     * Creates a Mongo Schema. Expects all properties passed in `obj`
     * to be also present in the type `T`. Does not allow properties
     * defined in `IAuditDatesModel` interface to be passed in, because the audit
     * fields (`createdTimestamp` and `updatedTimestamp`) are automatically
     * added by Mongo.
     * The expected use case of this method is in the example below. Even if
     * `IMyEntity` doesn't extend `IAuditDatesModel`, the audit properties will be added
     * by Mongo, but won't be accessible through the interface.
     *
     * @example
     * interface IMyEntity extends IAuditDatesModel {
     *     myProperty: string;
     * }
     * DbHelper.MakeSchema<IMyEntity>({
     *     myProperty: { type: String, default: null },
     *     createdTimestamp: { type: Date } // ERROR! this is an IAuditDatesModel property and can't be set
     * })
     *
     * @param obj MongoDB schema description, excluding the AuditDates properties.
     */
    public static MakeSchema<T>(obj: Omit<Record<keyof T, unknown>, keyof IAuditDatesModel>): Schema {
        return new Schema(obj as never, <SchemaOptions> {
            timestamps: { createdAt: "createdOn", updatedAt: "lastUpdatedOn" }
        });
    }
}
