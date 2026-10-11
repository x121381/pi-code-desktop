import type { ModelConfigObject, ModelConfigResolution } from "@zcode/provider";
import type { ProviderSettingsFormModel } from "@/lib/providerSettingsFormTypes.js";
import { type ProviderModelDraftValues } from "@/settings/model-provider-section/ProviderModelMetadata.js";
/** 添加和编辑共享推荐生命周期；业务入口仅保留初始化、权限与各自的保存事务。 */
export declare function useProviderModelDraft({ model, open, scopeKey, resolve, }: {
    model: ProviderSettingsFormModel;
    open: boolean;
    scopeKey: string;
    resolve?: (modelId: string, personalConfig: ModelConfigObject) => Promise<ModelConfigResolution>;
}): {
    draft: ProviderModelDraftValues;
    change: (patch: Partial<ProviderModelDraftValues>) => void;
    reset: (nextModel: ProviderSettingsFormModel) => void;
    restore: () => Promise<void>;
    commit: () => Promise<import("@/settings/model-provider-section/ProviderModelMetadata.js").ProviderModelDraftCommitResult>;
    overrides: ReadonlySet<string>;
    inheritedConfig: Readonly<{
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
    }> | undefined;
    pending: boolean;
    defaultsLoaded: boolean;
    flush: () => Promise<ModelConfigResolution | undefined>;
    cancel: () => void;
};
//# sourceMappingURL=useProviderModelDraft.d.ts.map