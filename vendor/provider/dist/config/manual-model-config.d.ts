import { z } from "zod";
import { modelConfigDataSchema } from "@zcode/shared/model-config";
export declare const manualModelConfigSchema: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    properties: z.ZodObject<{
        contextWindow: z.ZodNumber;
        supportsJsonSchemaOutput: z.ZodBoolean;
        supportsNativeWebSearch: z.ZodBoolean;
        supportsMidConversationSystem: z.ZodBoolean;
        inputFormat: z.ZodObject<{
            supportsImage: z.ZodBoolean;
            supportsVideo: z.ZodBoolean;
            supportsPdf: z.ZodBoolean;
        }, z.core.$strict>;
    }, z.core.$strict>;
    optionSpecs: z.ZodObject<{
        reasoningLevel: z.ZodObject<{
            values: z.ZodReadonly<z.ZodArray<z.ZodString>>;
            map: z.ZodString;
        }, z.core.$strict>;
        maxOutputTokens: z.ZodObject<{
            max: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ManualModelConfig = z.infer<typeof manualModelConfigSchema>;
/** 草稿/旧完整规则提取复用 schema 结构，避免维护第二份可编辑字段清单。 */
export declare function extractManualModelConfig(input: unknown): ManualModelConfig;
/** 保留独立 enabled 和系统叶子；恢复智能配置及规则合成都使用同一字段归属。 */
export declare function clearManualModelConfig(input: z.infer<typeof modelConfigDataSchema>): {
    properties?: {
        inputFormat?: {
            supportsText?: boolean | null | undefined;
            supportsImage?: boolean | null | undefined;
            supportsVideo?: boolean | null | undefined;
            supportsAudio?: boolean | null | undefined;
            supportsPdf?: boolean | null | undefined;
        } | null | undefined;
        outputFormat?: {
            supportsText?: boolean | null | undefined;
        } | null | undefined;
        requiresMfjsToolSchema?: boolean | null | undefined;
        contextWindow?: number | null | undefined;
        supportsToolCall?: boolean | null | undefined;
        supportsJsonSchemaOutput?: boolean | null | undefined;
        supportsNativeWebSearch?: boolean | null | undefined;
        supportsMidConversationSystem?: boolean | null | undefined;
    } | null | undefined;
    optionSpecs?: {
        reasoningLevel?: {
            values?: readonly string[] | null | undefined;
            map?: string | null | undefined;
        } | null | undefined;
        maxOutputTokens?: {
            max?: number | null | undefined;
            map?: string | null | undefined;
        } | null | undefined;
    } | null | undefined;
    enabled?: boolean | null | undefined;
};
//# sourceMappingURL=manual-model-config.d.ts.map