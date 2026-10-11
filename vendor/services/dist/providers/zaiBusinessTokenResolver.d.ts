import type { ApiClient } from "@zcode/shared";
interface ZaiBusinessTokenResolverOptions {
    apiClient: ApiClient;
    loginUrl: string;
    timeoutMs: number;
    now?: () => number;
}
export declare class ZaiBusinessTokenResolver {
    private readonly apiClient;
    private readonly loginUrl;
    private readonly timeoutMs;
    private readonly now;
    private cachedToken;
    constructor(options: ZaiBusinessTokenResolverOptions);
    resolve(oauthAccessToken: string): Promise<string>;
    private isCachedTokenValid;
    private exchangeBusinessToken;
}
export {};
//# sourceMappingURL=zaiBusinessTokenResolver.d.ts.map