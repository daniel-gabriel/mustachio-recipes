import * as pino from "pino";
import Keys from "./config/Keys";

export enum LogLevel {
    Error = "error",
    Warn = "warn",
    Info = "info",
    Debug = "debug"
}

export interface ILoggerFactory {
    makeLogger(loggerName: string): ILogger;
}

export class LoggerFactory implements ILoggerFactory {
    private static readonly DefaultLogLevel: LogLevel = (Keys.NODE_ENV === "production" ? LogLevel.Info : LogLevel.Debug);

    public readonly logLevel: LogLevel;
    public constructor(logLevel: LogLevel = LoggerFactory.DefaultLogLevel) {
        if (Object.values(LogLevel).indexOf(logLevel) === -1) {
            throw new Error(`Log level '${logLevel}' is invalid`);
        }
        this.logLevel = logLevel;
    }

    public makeLogger(loggerName: string): ILogger {
        if (!loggerName) {
            throw new Error("A logger name must be provided.");
        }
        const logger = pino.default({
            name: loggerName,
            level: this.logLevel,
            // prettyPrint: {
            //     colorize: this.logLevel === "debug", // colorize output if log level is set to "debug"
            //     translateTime: "SYS:standard"
            // }
        });
        return new Logger(logger);
    }
}

export interface ILogger {

    error(msg: string, ...args: any[]): void;
    error<T extends object>(obj: T, msg?: string, ...args: any[]): void;

    warn(msg: string, ...args: any[]): void;
    warn<T extends object>(obj: T, msg?: string, ...args: any[]): void;

    info(msg: string, ...args: any[]): void;
    info<T extends object>(obj: T, msg?: string, ...args: any[]): void;

    debug(msg: string, ...args: any[]): void;
    debug<T extends object>(obj: T, msg?: string, ...args: any[]): void;
}

export class Logger implements ILogger {
    private readonly logger: pino.BaseLogger;

    public constructor(pinoInstance: pino.BaseLogger) {
        if (!pinoInstance) {
            throw new Error("A pino logger instance must be provided for this logger to work properly.");
        }
        this.logger = pinoInstance;
    }

    public error(msg: string, ...args: any[]): void;
    public error<T extends object>(obj: T, msg?: string, ...args: any[]): void {
        this.logger.error(obj, msg, args);
    }

    public warn(msg: string, ...args: any[]): void;
    public warn<T extends object>(obj: T, msg?: string, ...args: any[]): void {
        this.logger.warn(obj, msg, args);
    }

    public info(msg: string, ...args: any[]): void;
    public info<T extends object>(obj: T, msg?: string, ...args: any[]): void {
        this.logger.info(obj, msg, args);
    }

    public debug(msg: string, ...args: any[]): void;
    public debug<T extends object>(obj: T, msg?: string, ...args: any[]): void {
        this.logger.debug(obj, msg, args);
    }
}
