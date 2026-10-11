import { z } from "zod";
/**
 * 执行 Selection 退回 Session Selection 的原因。由发起方在 selectionFallback 规则里声明，
 * CLI 只透传命中规则的原因，不自行解释 provider 错误码。
 */
export declare const modelExecutionSelectionFallbackReasonSchema: z.ZodEnum<{
    highspeed_card_expired: "highspeed_card_expired";
    highspeed_request_failed: "highspeed_request_failed";
}>;
/** 文本与附件发送共用执行约束，凭据只属于单次执行，不进入 Session 配置。 */
export declare const modelExecutionSchema: z.ZodObject<{
    memoryExtraction: z.ZodOptional<z.ZodLiteral<"skip">>;
    selectionScope: z.ZodLiteral<"execution">;
    requestAuth: z.ZodOptional<z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodString>;
        apiKeyId: z.ZodOptional<z.ZodString>;
        accountScope: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>>;
    subagents: z.ZodOptional<z.ZodObject<{
        foregroundModel: z.ZodLiteral<"submission">;
        background: z.ZodLiteral<"deny">;
    }, z.core.$strict>>;
    selectionFallback: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        rules: z.ZodArray<z.ZodObject<{
            reason: z.ZodEnum<{
                highspeed_card_expired: "highspeed_card_expired";
                highspeed_request_failed: "highspeed_request_failed";
            }>;
            providerErrorCode: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        target: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ModelExecution = z.infer<typeof modelExecutionSchema>;
export type ModelExecutionSelectionFallback = NonNullable<ModelExecution["selectionFallback"]>;
export type ModelExecutionSelectionFallbackRule = ModelExecutionSelectionFallback["rules"][number];
export type ModelExecutionSelectionFallbackReason = z.infer<typeof modelExecutionSelectionFallbackReasonSchema>;
//# sourceMappingURL=model-execution.d.ts.map