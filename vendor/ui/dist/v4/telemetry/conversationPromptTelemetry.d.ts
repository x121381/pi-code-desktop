import { type PlanIdentitySnapshot, type ZCodeProvider } from "@zcode/shared";
export declare function resolveLegacyConversationModelValue(params: {
    configProvider?: string | null;
    modelName?: string | null;
}): string | null | undefined;
export declare function resolveLegacyRuntimeModelValue(params: {
    configProvider?: string | null;
    modelName?: string | null;
}): string | null | undefined;
/** V4 config.provider 是实际模型 provider id；agentProvider 表示 ZCode 运行时。 */
export declare function buildV4ConversationPromptTelemetryExtraDetail(params: {
    agentProvider?: ZCodeProvider;
    configProvider?: string | null;
    modelName?: string | null;
    askMode?: string | null;
    providerBaseURL?: string | null;
    planIdentitySnapshot?: PlanIdentitySnapshot | null;
}): Record<string, string>;
//# sourceMappingURL=conversationPromptTelemetry.d.ts.map