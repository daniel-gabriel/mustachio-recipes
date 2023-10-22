import {NextFunction, Response, Request} from "express";
import {IProblemJson} from "./IProblemJson";
import {BaseHttpError, ValidationError} from "./HttpErrors";
import {ValidateError} from "tsoa";
import {ILogger} from "../../startup/LoggerFactory";

/**
 * This class is meant to be used as an Express middleware, like this:
 * @example
 * const logger = new LoggerFactory().makeLogger(__filename);
 * const errorToJsonConverter = new DefaultErrorToProblemJsonConverter(logger); // OR `undefined` if there is no logger
 * app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction): void => {
 *     errorToJsonConverter.sendErrorAsProblemJson(err as any, req, res, next);
 *     next();
 * });
 *
 *
 * The error response is in the format of problem+json, which looks similar to this:
 * @example
 * {
 *     status: 400,
 *     title: "Bad Request",
 *     detail: "entityType - Entity type must be one of: User, Driver, Requester, PickupRequest, NotificationSubscription",
 *     type: "about:blank",
 *     instance: "/history?entityType=ARequest&entityId=abcdef-123456"
 * }
 * Here is link to more information about the format: https://lakitna.medium.com/understanding-problem-json-adf68e5cf1f8
 *
 * In production, the error stack trace is not included in the error response, otherwise it's included if available.
 * If a `logger` was specified in the constructor and the error status code is 500, it is logged as a warning.
 */
export class DefaultErrorToProblemJsonConverter {
    private readonly logger?: ILogger;
    private readonly includeStackTrace: boolean;

    public constructor(logger?: ILogger) {
        this.logger = logger;
        this.includeStackTrace = process.env.NODE_ENV !== "production";
    }

    /**
     * Given an error, converts available information from it to a problem JSON format.
     * If headers were already sent, the error handler will log the error if a logger was provided,
     * but won't send any response.
     * @param err The error that was thrown.
     * @param req The Express Request.
     * @param res The Express Response.
     * @param next The Express `next()` function which invokes the next middleware inline. This function will be called
     * at the end of the handler.
     */
    public sendErrorAsProblemJson(err: Error|undefined, req: Request, res: Response, next: NextFunction): void {
        const problemJson = this.makeProblemJson(err, req?.originalUrl);
        if (this.logger && problemJson.status === 500) {
            this.logger.warn(err ? err : new Error("Unknown error"));
        }
        // if headers have already been sent, the controller action already handled the error and sent the response. don't send anything.
        if (!res.headersSent) {
            res.contentType("application/problem+json");
            res.status(problemJson.status);
            res.json(problemJson);
        }
        next(err);
    }

    /**
     * Converts the given error and `instanceUrl` to a Problem JSON object.
     * @param error The error that needs to be converted.
     * @param instanceUrl The instance URL pointing to the API location that caused this error.
     * @private
     */
    private makeProblemJson(error?: Error, instanceUrl?: string): IProblemJson {
        let status;
        let extraData: Record<string, IErroredPropDescriptor> = {};
        let detail;

        // handle tsoa ValidateError
        if (error instanceof ValidateError) {
            status = 400;
            detail = Object.keys(error.fields)
                .map(propName => `${propName ? propName.replace("$", "") + " - " : ""}${error.fields[propName].message}`)
                .join("\r\n");

            Object.keys(error.fields)
                .forEach(propName => {
                    extraData[propName.replace("$", "")] = {
                        description: error.fields[propName].message
                    }
                });
            detail = Object.keys(extraData)
                .map(propName => `${propName ? propName + " - " : ""}${extraData[propName].description}`)
                .join("\r\n");


                // .map(propName => `${propName ? propName.replace("$", "") + " - " : ""}${error.fields[propName].message}`)
                // .join("\r\n")
        }
        // handle errors that have BaseHttpError properties
        else {
            status = (error as BaseHttpError)?.statusCode || 500;
            extraData = (error as BaseHttpError)?.extraData;

            const validationPropertyName = (error as ValidationError)?.propertyName;
            const validationErrorCode = (error as ValidationError)?.errorCode;
            const prefix = validationPropertyName ? `${validationPropertyName} - ` : "";
            detail = `${prefix}${error?.message}`;
            if (validationPropertyName) {
                extraData = DefaultErrorToProblemJsonConverter.addErroredPropsToExtraData(extraData, {
                    [validationPropertyName]: {
                        description: error?.message || "",
                        errorCode: validationErrorCode
                    }
                });
            }
        }

        const result: IProblemJson = {
            extraData: extraData,
            status: status,
            // since currently the `type` URL is "about:blank", the `title` has to be a standard description of the
            // HTTP status code.
            title: DefaultErrorToProblemJsonConverter.mapStatusCode(status),
            detail: detail,
            type: "about:blank",
            // this should be the URL where the error occurred or blank
            instance: instanceUrl || ""
        };
        if (this.includeStackTrace) {
            result.stackTrace = error?.stack;
        }
        return result;
    }

    private static addErroredPropsToExtraData(
        extraData: any|undefined, props: {[key: string]: IErroredPropDescriptor}
    ): Record<string, IErroredPropDescriptor> {
        const erroredProps: {[key: string]: IErroredPropDescriptor} = {};
        Object.keys(props).forEach(key => erroredProps[key] = {description: props[key].description, errorCode: props[key].errorCode });

        if (Object.keys(erroredProps).length) {
            // there were some errored properties, we need a valid extraData object
            extraData = extraData || {};
            extraData.erroredProperties = erroredProps;
        }
        return extraData;
    }

    private static mapStatusCode(status: number | undefined): string {
        switch (status) {
            case 400:
                return "Bad Request";
            case 401:
                return "Unauthorized";
            case 403:
                return "Forbidden";
            case 404:
                return "Not Found";
            case 500:
            default:
                return "Internal Server Error";
        }
    }
}

interface IErroredPropDescriptor {
    description: string;
    errorCode?: string;
}
