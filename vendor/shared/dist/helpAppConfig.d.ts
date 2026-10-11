import { z } from "zod";
declare const helpConfigSchema: z.ZodObject<{
    community_urls: z.ZodCatch<z.ZodOptional<z.ZodObject<{
        "zh-CN": z.ZodCatch<z.ZodOptional<z.ZodString>>;
        "en-US": z.ZodCatch<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>;
    feedback_url: z.ZodCatch<z.ZodOptional<z.ZodString>>;
    feedback_use_external_form: z.ZodCatch<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type HelpAppConfig = z.infer<typeof helpConfigSchema>;
export declare function buildHelpAppConfigUrl(endpoint: string, version: string, platform?: string): string;
export declare function resolveHelpAppConfig(remote: unknown, local: unknown): HelpAppConfig;
/** 公开帮助配置仅做内存缓存，不共享带用户鉴权的灰度响应。 */
export declare function createHelpAppConfigReader(options: {
    fetchImpl: typeof fetch;
    now?: () => number;
}): (url: string, headers?: RequestInit["headers"]) => Promise<HelpAppConfig>;
export {};
//# sourceMappingURL=helpAppConfig.d.ts.map