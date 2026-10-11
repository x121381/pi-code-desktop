import type { ModelConfigRules, ModelId, ProviderConfig, ProviderId, ProviderTemplateId, ProviderConfigRule, ProviderTemplateLocale } from "./config/index.js";
import { ModelConfig, ProviderConfigMap, ProviderTemplateMap } from "./config/index.js";
import type { ModelSelection } from "@zcode/shared/model-selection";
import type { ProviderConfigSnapshot, ProviderSource } from "./sources.js";
export interface ProviderConfigLayerSnapshot {
    readonly revision: string;
    readonly providers: ProviderConfigMap;
    readonly providerTemplates?: ProviderTemplateMap;
    readonly models: ModelConfigRules;
    readonly providerOrder?: readonly ProviderId[];
    readonly defaultModelSelection?: ModelSelection;
}
export interface ProviderConfigLayerUpdate {
    readonly providers: ProviderConfigMap;
    readonly providerTemplates?: ProviderTemplateMap;
    readonly models: ModelConfigRules;
    readonly providerOrder?: readonly ProviderId[];
    readonly defaultModelSelection?: ModelSelection;
}
export interface PersonalProviderConfigRepository extends ProviderSource<ProviderConfigLayerSnapshot> {
    update(transform: (current: ProviderConfigLayerSnapshot) => ProviderConfigLayerUpdate): Promise<ProviderConfigLayerSnapshot>;
}
export interface ProviderConfigServiceDependencies {
    readonly zcodeBuiltinSource: ProviderSource<ProviderConfigLayerSnapshot>;
    readonly personalRepository: PersonalProviderConfigRepository;
}
export interface PersonalProviderCreation {
    readonly providerId: ProviderId;
}
export interface CreatePersonalProviderInput {
    readonly templateId?: ProviderTemplateId;
    readonly providerName?: string;
    readonly locale?: ProviderTemplateLocale;
    readonly initialConfig?: ProviderConfig;
}
/** Facade 提供的 Host 内部成员事实；不得接受 Renderer 自报的模型名单。 */
export interface ProviderModelMembership {
    readonly providerId: ProviderId;
    readonly inheritedModelIds: readonly ModelId[];
    readonly personalRevision: string;
    /** 在 Personal 事务内检查发布快照未过期，不触发网络请求。 */
    readonly assertCurrent: () => void;
}
export declare class ProviderConfigService implements ProviderSource<ProviderConfigSnapshot> {
    #private;
    constructor(dependencies: ProviderConfigServiceDependencies);
    read(): Promise<ProviderConfigSnapshot>;
    onDidChange(listener: (reason: string) => void): () => void;
    /** 仅供版本迁移或事实源 cutover 原子替换完整 Personal Overlay。 */
    replacePersonalConfig(config: ProviderConfigLayerUpdate): Promise<ProviderConfigLayerSnapshot>;
    savePersonalProviderOverlay(providerId: ProviderId, config: ProviderConfig, membership?: ProviderModelMembership, metadata?: Pick<ProviderConfigRule, "providerName" | "templateId" | "enabled">): Promise<ProviderConfigLayerSnapshot>;
    createPersonalProvider(input?: CreatePersonalProviderInput): Promise<PersonalProviderCreation>;
    deletePersonalProvider(providerId: ProviderId): Promise<ProviderConfigLayerSnapshot>;
    reorderPersonalProviders(providerIds: readonly ProviderId[]): Promise<ProviderConfigLayerSnapshot>;
    reorderPersonalModels(providerId: ProviderId, modelIds: readonly ModelId[], membership?: ProviderModelMembership): Promise<ProviderConfigLayerSnapshot>;
    addPersonalModel(providerId: ProviderId, modelId: ModelId, config: ModelConfig, membership?: ProviderModelMembership, useRecommendedConfig?: boolean): Promise<ProviderConfigLayerSnapshot>;
    renamePersonalModel(providerId: ProviderId, currentModelId: ModelId, nextModelId: ModelId, membership?: ProviderModelMembership): Promise<ProviderConfigLayerSnapshot>;
    setPersonalModelEnabled(providerId: ProviderId, modelId: ModelId, enabled: boolean, membership?: ProviderModelMembership): Promise<ProviderConfigLayerSnapshot>;
    /** Model 编辑弹窗的唯一写入边界：成员、顺序、精确 Rule 在同一次 Repository update 中提交。 */
    savePersonalModelDraft(providerId: ProviderId, originalModelId: ModelId, nextModelId: ModelId, config: ModelConfig, expectedPersonalRevision: string, useRecommendedConfig?: boolean, membership?: ProviderModelMembership): Promise<ProviderConfigLayerSnapshot>;
    deletePersonalModel(providerId: ProviderId, modelId: ModelId, membership?: ProviderModelMembership): Promise<ProviderConfigLayerSnapshot>;
    dispose(): void;
}
//# sourceMappingURL=config-service.d.ts.map