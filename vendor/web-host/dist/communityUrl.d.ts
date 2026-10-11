import { type Locale } from "@zcode/shared";
interface ResolveWebCommunityUrlOptions {
    fetchImpl?: typeof fetch;
    localConfig?: unknown;
    endpointOrigin?: string;
}
export declare function resolveWebHelpConfig(options?: ResolveWebCommunityUrlOptions): Promise<{
    community_urls?: {
        "zh-CN"?: string | undefined;
        "en-US"?: string | undefined;
    } | undefined;
    feedback_url?: string | undefined;
    feedback_use_external_form?: boolean | undefined;
}>;
export declare function resolveWebCommunityUrl(locale: Locale, options?: ResolveWebCommunityUrlOptions): Promise<string | undefined>;
export {};
