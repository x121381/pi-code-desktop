import { type ConversationShareApiErrorCode, type ConversationSharePreview, type Locale } from "@zcode/shared";
export type ConversationSharePreviewErrorKind = "authentication_required" | "not_found" | "expired" | "rate_limited" | "network" | "invalid_contract" | "unsupported_schema_version" | "unknown";
export declare class ConversationSharePreviewClientError extends Error {
    readonly kind: ConversationSharePreviewErrorKind;
    readonly status?: number;
    readonly code?: ConversationShareApiErrorCode;
    constructor(options: {
        kind: ConversationSharePreviewErrorKind;
        message: string;
        status?: number;
        code?: ConversationShareApiErrorCode;
        cause?: unknown;
    });
}
export declare function isSafeConversationShareCode(value: string): boolean;
export declare function parseConversationShareRoute(pathname: string): string | null;
/** 页面语言由路径前缀决定：/cn/share 中文，裸 /share 英文；非分享路径回退到浏览器语言。 */
export declare function resolveConversationShareRouteLocale(pathname: string): Locale;
export declare function buildShareImportDeepLink(shareCode: string): string;
export interface ConversationSharePreviewClientOptions {
    baseUrl: string;
    fetchImpl?: typeof fetch;
    diagnostics?: ConversationSharePreviewDiagnostics;
}
export interface ConversationSharePreviewDiagnostics {
    info(event: string, details: Record<string, unknown>): void;
    warn(event: string, details: Record<string, unknown>): void;
}
export declare class ConversationSharePreviewClient {
    private readonly baseUrl;
    private readonly fetchImpl;
    private readonly diagnostics;
    constructor(options: ConversationSharePreviewClientOptions);
    getPreview(shareCode: string, accessToken?: string): Promise<ConversationSharePreview>;
}
