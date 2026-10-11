export interface ApiRequestInit extends RequestInit {
    timeoutMs?: number;
}
export interface ApiClient {
    request(input: string | URL, init?: ApiRequestInit): Promise<Response>;
}
export interface ApiErrorOptions {
    message: string;
    url: string;
    method?: string;
    status?: number;
    responseHeaders?: Record<string, string>;
    cause?: unknown;
}
export declare class ApiError extends Error {
    readonly url: string;
    readonly method: string;
    readonly status?: number;
    readonly responseHeaders?: Record<string, string>;
    constructor(options: ApiErrorOptions);
}
//# sourceMappingURL=api.d.ts.map