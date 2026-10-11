import type { ProviderSettingsFormModel } from "@/lib/providerSettingsFormTypes.js";
import type { ModelInputFormatData } from "@zcode/shared/model-config";
export type ProviderModelInputFormatDraft = ModelInputFormatData;
export interface ProviderModelDraftValues {
    idValue: string;
    contextWindowValue: string;
    maxOutputTokensValue: string;
    inputFormatValue: ProviderModelInputFormatDraft;
    enabledValue?: boolean;
    useRecommendedConfigValue?: boolean;
    /** 仅在本次 Draft 从固定模式切回推荐模式时清空已有 Overlay。 */
    clearPersonalConfigValue?: boolean;
    /** 字段来源是用户意图，不依赖整份表单是否有效或数值是否恰好等于推荐。 */
    overriddenFieldsValue?: readonly string[];
    supportsJsonSchemaOutputValue?: boolean;
    supportsNativeWebSearchValue?: boolean;
    supportsMidConversationSystemValue?: boolean;
    reasoningLevelValuesValue: readonly string[];
    reasoningLevelMapValue: string;
}
export type ProviderModelDraftCommitResult = {
    status: "commit";
    model: ProviderSettingsFormModel;
} | {
    status: "invalid";
    field: "id" | "contextWindow" | "maxOutputTokens" | "inputFormat" | "reasoningLevelValues" | "reasoningLevelMap";
};
export declare function createProviderModelDraftValues(model: ProviderSettingsFormModel): ProviderModelDraftValues;
export declare function resolveProviderModelDraftCommit({ currentModel, draft, }: {
    currentModel: ProviderSettingsFormModel;
    draft: ProviderModelDraftValues;
}): ProviderModelDraftCommitResult;
//# sourceMappingURL=ProviderModelMetadata.d.ts.map