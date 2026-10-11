import { z } from "zod";
export declare const REWARDS_PARTITION = "persist:zcode-rewards";
export declare const REWARDS_CONTEXT_EVENT = "zcode-rewards-context";
export declare const rewardsContextSchema: z.ZodObject<{
    theme: z.ZodEnum<{
        "zai-light": "zai-light";
        "zai-dark": "zai-dark";
    }>;
    locale: z.ZodEnum<{
        "zh-CN": "zh-CN";
        "en-US": "en-US";
    }>;
    auth: z.ZodObject<{
        status: z.ZodEnum<{
            ready: "ready";
            anonymous: "anonymous";
        }>;
        provider: z.ZodNullable<z.ZodEnum<{
            bigmodel: "bigmodel";
            zai: "zai";
        }>>;
        revision: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type RewardsContext = z.infer<typeof rewardsContextSchema>;
export declare function isTrustedRewardsUrl(value: string, options?: {
    dev?: boolean;
    e2e?: boolean;
}): boolean;
export declare function resolveRewardsOrigin(options: {
    env: "test" | "production";
    dev?: boolean;
    override?: string;
    e2e?: boolean;
}): string;
export declare function buildRewardsUrl(origin: string, locale: string, theme: RewardsContext["theme"]): string;
//# sourceMappingURL=rewardsEmbedded.d.ts.map