export class ApiError extends Error {
    url;
    method;
    status;
    responseHeaders;
    constructor(options) {
        super(options.message, options.cause === undefined ? undefined : { cause: options.cause });
        this.name = "ApiError";
        this.url = options.url;
        this.method = (options.method ?? "GET").toUpperCase();
        this.status = options.status;
        this.responseHeaders = options.responseHeaders;
    }
}
//# sourceMappingURL=api.js.map