import { type ApiClient, type ApiRequestInit } from "@zcode/shared";
interface NodeApiClientOptions {
    fetchImpl?: typeof fetch;
    onZcodeJwtInvalid?: (input: string | URL, headers: Headers) => void;
    isZcodeJwtRequest?: (input: string | URL, headers: Headers) => boolean | Promise<boolean>;
    isBusinessUnauthorizedRequest?: (input: string | URL, headers: Headers) => boolean | Promise<boolean>;
    businessUnauthorizedObservationTimeoutMs?: number;
    resolveZCodeEndpointOrigin?: () => Promise<string> | string;
}
export declare class NodeApiClient implements ApiClient {
    private readonly fetchImpl?;
    private readonly resolveZCodeEndpointOrigin?;
    private readonly onZcodeJwtInvalid?;
    private readonly isZcodeJwtRequest?;
    private readonly isBusinessUnauthorizedRequest?;
    private readonly businessUnauthorizedObservationTimeoutMs;
    constructor(options?: NodeApiClientOptions);
    request(input: string | URL, init?: ApiRequestInit): Promise<Response>;
}
export declare function createNodeApiClient(options?: NodeApiClientOptions): ApiClient;
export {};
//# sourceMappingURL=nodeApiClient.d.ts.map