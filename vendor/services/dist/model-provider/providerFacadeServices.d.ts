import type { Event } from "@zcode/rpc";
import { type ModelConfigObject, type ModelId, type ModelSelection, type ModelSelectionFacade, type ModelSelectionView, type ModelSelectionViewInput, type ProviderConfigObject, type ProviderId, type ProviderSettingsFacade, type ProviderSettingsCreationResult, type ModelConfigResolution, type ProviderSettingsView, type ResolveModelConfigInput, type SavePersonalModelDraftInput } from "@zcode/provider";
import type { ModelConnectivityResult } from "@zcode/shared";
export type { ProviderSettingsProviderView, ModelSelectionView, ModelSelectionViewInput, ProviderSettingsView, } from "@zcode/provider";
export interface IProviderSettingsService {
    readonly onDidChange: Event<ProviderSettingsView>;
    getView(): Promise<ProviderSettingsView>;
    refresh(reason: string): Promise<ProviderSettingsView>;
    createPersonalProvider(input?: Parameters<ProviderSettingsFacade["createPersonalProvider"]>[0]): Promise<ProviderSettingsCreationResult>;
    resolveModelConfig(input: ResolveModelConfigInput): Promise<ModelConfigResolution>;
    savePersonalProviderOverlay(providerId: ProviderId, config: ProviderConfigObject, metadata?: Parameters<ProviderSettingsFacade["savePersonalProviderOverlay"]>[2]): Promise<ProviderSettingsView>;
    deletePersonalProvider(providerId: ProviderId): Promise<ProviderSettingsView>;
    reorderPersonalProviders(providerIds: readonly ProviderId[]): Promise<ProviderSettingsView>;
    reorderPersonalModels(providerId: ProviderId, modelIds: readonly ModelId[]): Promise<ProviderSettingsView>;
    addPersonalModel(providerId: ProviderId, modelId: ModelId, config: ModelConfigObject, useRecommendedConfig?: boolean): Promise<ProviderSettingsView>;
    renamePersonalModel(providerId: ProviderId, currentModelId: ModelId, nextModelId: ModelId): Promise<ProviderSettingsView>;
    deletePersonalModel(providerId: ProviderId, modelId: ModelId): Promise<ProviderSettingsView>;
    savePersonalModelDraft(input: SavePersonalModelDraftInput): Promise<ProviderSettingsView>;
    setPersonalModelEnabled(providerId: ProviderId, modelId: ModelId, enabled: boolean): Promise<ProviderSettingsView>;
    /** 测试已经保存并进入目标 Environment Registry 的正式 Model。 */
    testModelConnectivity(input: ProviderSettingsConnectivityRequest): Promise<ModelConnectivityResult>;
}
export declare const IProviderSettingsService: import("../descriptors.js").ServiceDescriptor<IProviderSettingsService>;
export interface ProviderSettingsConnectivityTestInput {
    readonly workspacePath: string;
    readonly workspaceIdentity?: string;
    readonly providerId: ProviderId;
    readonly modelId: ModelId;
}
export interface ProviderSettingsConnectivityRequest {
    readonly workspacePath: string;
    readonly workspaceIdentity?: string;
    readonly providerId: ProviderId;
    readonly modelId: ModelId;
}
export type ProviderSettingsConnectivityTester = (input: ProviderSettingsConnectivityTestInput) => Promise<ModelConnectivityResult>;
export interface IModelSelectionService {
    readonly onDidChange: Event<ModelSelectionView>;
    getView(input?: ModelSelectionViewInput): Promise<ModelSelectionView>;
}
export interface ModelSelectionConfiguredDefaultSource {
    read(): Promise<ModelSelection | undefined>;
    onDidChange?(listener: () => void): () => void;
}
export declare const IModelSelectionService: import("../descriptors.js").ServiceDescriptor<IModelSelectionService>;
export declare function createProviderSettingsService(facade: ProviderSettingsFacade, ensureReady?: () => Promise<void>, testConnectivity?: ProviderSettingsConnectivityTester): IProviderSettingsService;
export declare function createModelSelectionService(facade: ModelSelectionFacade, ensureReady?: () => Promise<void>, configuredDefaultSource?: ModelSelectionConfiguredDefaultSource): IModelSelectionService & {
    dispose(): void;
};
//# sourceMappingURL=providerFacadeServices.d.ts.map