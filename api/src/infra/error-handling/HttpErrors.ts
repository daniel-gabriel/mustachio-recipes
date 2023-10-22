// There are `Object.setPrototypeOf(...)` calls in the sub-classes of Error. It's a workaround for typescript's
// lacking support for Error sub-classes, see here:
// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

export class BaseHttpError extends Error {
    public constructor(public statusCode: number, public message: string, public extraData: any = null) {
        super(message);
        // hacky work-around for typescript's limited support for extended Error classes
        // Object.setPrototypeOf(this, BaseHttpError.prototype);
        this.statusCode = statusCode || 500;
        this.message = message;
    }
}

export class InternalServerError extends BaseHttpError {
    public constructor(message?: string) {
        super(500, message || "Internal server error");
        // hacky work-around for typescript's limited support for extended Error classes
        // Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

export class NotFoundError extends BaseHttpError {
    public constructor(message: string) {
        super(404, message);
        // hacky work-around for typescript's limited support for extended Error classes
        // Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class ValidationError extends BaseHttpError {
    public propertyName: string;
    public errorCode: string|undefined;
    public constructor(
        propertyName: string, errorMessage: string, errorCode: string|undefined = undefined, extraData: any = undefined
    ) {
        super(400, errorMessage, extraData);
        this.propertyName = propertyName;
        this.errorCode = errorCode;
        // hacky work-around for typescript's limited support for extended Error classes
        // Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class PermissionError extends BaseHttpError {
    public constructor(errorMessage: string) {
        super(403, errorMessage);
        // hacky work-around for typescript's limited support for extended Error classes
        // Object.setPrototypeOf(this, PermissionError.prototype);
    }
}
