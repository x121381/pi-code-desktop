import type { ConfigValidationIssue } from "./config-overlay.js";
import type { ProviderModelMembership } from "./config-service.js";
import type { ModelConfig, ModelConfigObject, ModelId, ProviderConfig, ProviderConfigObject, ProviderId, ProviderTemplateId } from "./config/index.js";
import { type ProviderConfigRule, type ProviderTemplateNameMap, type ProviderTemplateLocale } from "./config/index.js";
import type { ProviderRegistryView } from "./registry.js";
import { type RegistryModelConfigObject } from "./resolver.js";
import { type EffectiveModelSelectionResult, type ModelSelectionProviderClassifier } from "./effective-model-selection.js";
import type { ModelSelection } from "./registry.js";
import type { ProviderRegistryServiceChangedEvent, ProviderRegistryServiceSnapshot } from "./registry-service.js";
export interface ProviderRegistryFacadeSource {
    getSnapshot(): ProviderRegistryServiceSnapshot | null;
    getView(): ProviderRegistryView;
    refresh(reason: string): Promise<ProviderRegistryServiceSnapshot>;
    onDidChange(listener: (event: ProviderRegistryServiceChangedEvent) => void): () => void;
}
export interface ProviderSettingsMutationTarget {
    createPersonalProvider(input?: {
        readonly templateId?: ProviderTemplateId;
        readonly providerName?: string;
        readonly locale?: ProviderTemplateLocale;
        readonly initialConfig?: ProviderConfig;
    }): Promise<{
        readonly providerId: ProviderId;
    }>;
    savePersonalProviderOverlay(providerId: ProviderId, config: ProviderConfig, membership?: ProviderModelMembership, metadata?: Pick<ProviderConfigRule, "providerName" | "templateId" | "enabled">): Promise<unknown>;
    deletePersonalProvider(providerId: ProviderId): Promise<unknown>;
    reorderPersonalProviders(providerIds: readonly ProviderId[]): Promise<unknown>;
    reorderPersonalModels(providerId: ProviderId, modelIds: readonly ModelId[], membership?: ProviderModelMembership): Promise<unknown>;
    addPersonalModel(providerId: ProviderId, modelId: ModelId, config: ModelConfig, membership?: ProviderModelMembership, useRecommendedConfig?: boolean): Promise<unknown>;
    renamePersonalModel(providerId: ProviderId, currentModelId: ModelId, nextModelId: ModelId, membership?: ProviderModelMembership): Promise<unknown>;
    deletePersonalModel(providerId: ProviderId, modelId: ModelId, membership?: ProviderModelMembership): Promise<unknown>;
    savePersonalModelDraft(providerId: ProviderId, originalModelId: ModelId, nextModelId: ModelId, config: ModelConfig, expectedPersonalRevision: string, useRecommendedConfig?: boolean, membership?: ProviderModelMembership): Promise<unknown>;
    setPersonalModelEnabled(providerId: ProviderId, modelId: ModelId, enabled: boolean, membership?: ProviderModelMembership): Promise<unknown>;
    refresh(reason: string): Promise<ProviderRegistryServiceSnapshot>;
    /** 主动重读上游事实后再刷新 Registry。 */
    refreshSources?(reason: string): Promise<ProviderRegistryServiceSnapshot>;
}
export interface ProviderSettingsModelCandidateView {
    readonly kind: "candidate";
    readonly modelId: ModelId;
    readonly builtin: boolean;
    readonly effectiveBuiltinConfig: ModelConfigObject;
    readonly personalExactConfig?: ModelConfigObject;
    readonly useRecommendedConfig?: boolean;
    readonly effectiveConfig: RegistryModelConfigObject | ModelConfigObject;
    readonly enabled: boolean;
    readonly executable: boolean;
    readonly selectable: boolean;
    readonly issues: readonly ConfigValidationIssue[];
}
export type ProviderSettingsModelView = ProviderSettingsModelCandidateView;
export interface ModelConfigResolution {
    readonly inheritedConfig: ModelConfigObject;
    readonly effectiveConfig: ModelConfigObject;
    readonly issues: readonly ConfigValidationIssue[];
}
export type ResolveModelConfigInput = {
    readonly providerId: ProviderId;
    readonly modelId: ModelId;
} | {
    readonly providerId: ProviderId;
    readonly originalModelId: ModelId;
    readonly modelId: ModelId;
    readonly personalConfig: ModelConfigObject;
};
export interface SavePersonalModelDraftInput {
    readonly providerId: ProviderId;
    readonly originalModelId: ModelId;
    readonly nextModelId: ModelId;
    readonly personalConfig: ModelConfigObject;
    readonly useRecommendedConfig?: boolean;
    readonly basedOnRevision: number;
}
export interface ProviderSettingsProviderView extends Pick<ProviderConfigRule, "providerName" | "templateId"> {
    readonly enabled: boolean;
    readonly accountState?: import("./account-provider-state.js").AccountProviderState;
    readonly providerId: ProviderId;
    /** 当前 Effective Config 是否已经进入 Registry，可用于模型选择和创建。 */
    readonly executable: boolean;
    readonly effectiveBuiltinConfig?: ProviderConfigObject;
    readonly personalConfig?: ProviderConfigObject;
    readonly effectiveConfig: ProviderConfigObject;
    readonly issues: readonly ConfigValidationIssue[];
    readonly models: readonly ProviderSettingsModelView[];
}
export interface ProviderSettingsTemplateView {
    readonly templateId: ProviderTemplateId;
    readonly templateNameMap: ProviderTemplateNameMap;
    readonly config: ProviderConfigObject;
}
export interface ProviderSettingsView {
    readonly revision: number;
    readonly providerTemplates: readonly ProviderSettingsTemplateView[];
    readonly providerOrder: readonly ProviderId[];
    readonly providers: readonly ProviderSettingsProviderView[];
}
export interface ProviderSettingsCreationResult {
    readonly providerId: ProviderId;
    readonly view: ProviderSettingsView;
}
export interface ModelSelectionModelView {
    readonly modelId: ModelId;
    readonly config: RegistryModelConfigObject;
}
export interface ModelSelectionProviderView extends Pick<ProviderConfigRule, "providerName" | "templateId"> {
    readonly providerId: ProviderId;
    readonly config: ProviderConfigObject;
    readonly models: readonly ModelSelectionModelView[];
}
export interface ModelSelectionViewInput {
    readonly selection: ModelSelection | null;
}
export interface ModelSelectionView extends Partial<EffectiveModelSelectionResult> {
    readonly revision: number;
    readonly providers: readonly ModelSelectionProviderView[];
    readonly preferredSelection?: ModelSelection;
}
export declare class ProviderSettingsFacade {
    #private;
    constructor(source: ProviderRegistryFacadeSource, mutations?: ProviderSettingsMutationTarget);
    getView(): ProviderSettingsView;
    refresh(reason: string): Promise<ProviderSettingsView>;
    resolveModelConfig(input: ResolveModelConfigInput): ModelConfigResolution;
    onDidChange(listener: (view: ProviderSettingsView) => void): () => void;
    createPersonalProvider(input?: {
        readonly templateId?: ProviderTemplateId;
        readonly providerName?: string;
        readonly locale?: ProviderTemplateLocale;
        readonly initialConfig?: ProviderConfigObject;
    }): Promise<ProviderSettingsCreationResult>;
    savePersonalProviderOverlay(providerId: ProviderId, config: ProviderConfigObject, metadata?: Pick<ProviderConfigRule, "providerName" | "templateId" | "enabled">): Promise<ProviderSettingsView>;
    deletePersonalProvider(providerId: ProviderId): Promise<ProviderSettingsView>;
    reorderPersonalProviders(providerIds: readonly ProviderId[]): Promise<ProviderSettingsView>;
    reorderPersonalModels(providerId: ProviderId, modelIds: readonly ModelId[]): Promise<ProviderSettingsView>;
    addPersonalModel(providerId: ProviderId, modelId: ModelId, config: ModelConfigObject, useRecommendedConfig?: boolean): Promise<ProviderSettingsView>;
    renamePersonalModel(providerId: ProviderId, currentModelId: ModelId, nextModelId: ModelId): Promise<ProviderSettingsView>;
    deletePersonalModel(providerId: ProviderId, modelId: ModelId): Promise<ProviderSettingsView>;
    savePersonalModelDraft(input: SavePersonalModelDraftInput): Promise<ProviderSettingsView>;
    setPersonalModelEnabled(providerId: ProviderId, modelId: ModelId, enabled: boolean): Promise<ProviderSettingsView>;
    waitForProviderOperations(providerId: ProviderId): Promise<void>;
}
export declare class ModelSelectionFacade {
    #private;
    constructor(source: ProviderRegistryFacadeSource, classifyProvider?: ModelSelectionProviderClassifier, resolveLegacyReasoningLevel?: (snapshot: ProviderRegistryServiceSnapshot, selection: ModelSelection) => string | undefined);
    getView(configuredDefault?: ModelSelection, revision?: number, input?: ModelSelectionViewInput): ModelSelectionView;
    onDidChange(listener: (view: ModelSelectionView) => void): () => void;
}
/** 把一个已进入 Registry 的 Provider 投影为标准模型选择候选。调用方负责产品作用域。 */
export declare function projectModelSelectionProviderView(provider: ProviderRegistryView["providers"][number]): ModelSelectionProviderView;
//# sourceMappingURL=facades.d.ts.map