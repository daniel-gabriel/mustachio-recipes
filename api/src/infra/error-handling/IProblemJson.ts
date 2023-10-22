/**
 * Describes HTTP problems in a standard way.
 */
export interface IProblemJson {
    /**
     * Status code.
     */
    status: number;
    /**
     * Problem title.
     */
    title: string;
    /**
     * Problem detail.
     */
    detail: string;
    /**
     * Type. This should always be "about:blank".
     */
    type?: string;
    /**
     * URL that points to the entity that caused the problem, like `/recipes/123456`
     */
    instance?: string;
    /**
     * When in development environments, includes the error stack trace.
     */
    stackTrace?: string;

    /**
     * Additional (optional) data about the error.
     */
    extraData?: Record<string, unknown>;
}
