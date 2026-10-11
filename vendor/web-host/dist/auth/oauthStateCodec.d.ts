interface OAuthStatePayload {
    nonce: string;
    app_return_to?: string;
    return_to?: string;
}
interface ResolveSafeAppReturnToOptions {
    currentOrigin?: string;
}
export declare function buildOAuthState(payload: OAuthStatePayload): string;
export declare function parseOAuthState(state: string): OAuthStatePayload | null;
export declare function parseOptionalUrl(value?: string): URL | null;
export declare function isTrustedDevReturnTo(url: URL): boolean;
export declare function resolveSafeAppReturnTo(value?: string, options?: ResolveSafeAppReturnToOptions): string | null;
export declare function buildReturnToCallbackUrl(returnTo: string, params: {
    code?: string;
    error?: string;
    state: string;
}): string | null;
export {};
