export declare const ZCODE_SOURCE_HEADERS: {
    readonly "User-Agent": "ZCode/unknown";
    readonly "HTTP-Referer": "https://zcode.z.ai";
    readonly "X-Title": "Z Code@electron";
};
export interface BuildZCodeSourceHeadersFromContextOptions {
    appVersion?: string;
    arch?: string;
    clientLanguage?: string;
    clientTimezone?: string;
    deviceMid?: string;
    endpointOrigin?: string;
    osVersion?: string;
    platform?: string;
    releaseChannel?: string;
    sourceTitle?: string;
}
export declare function normalizeZCodeSourceHeaderValue(value: string | undefined): string | undefined;
export declare function buildZCodeSourceHeadersFromContext(options?: BuildZCodeSourceHeadersFromContextOptions): Record<string, string>;
//# sourceMappingURL=zcode-source-headers.d.ts.map