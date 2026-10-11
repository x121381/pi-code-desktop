import { ModelConfigRules, ProviderTemplateMap, parseModelConfig, parseProviderConfig, } from "./config/index.js";
import { serializeRegistryModelConfig, serializeRegistryProviderConfig, } from "./resolver.js";
import { resolveInitialModelSelection } from "./model-selection-config.js";
import { resolveEffectiveModelSelection, } from "./effective-model-selection.js";
export class ProviderSettingsFacade {
    #source;
    #mutations;
    #providerMutationTails = new Map();
    constructor(source, mutations) {
        this.#source = source;
        this.#mutations = mutations;
    }
    getView() {
        const snapshot = requireSnapshot(this.#source);
        return createProviderSettingsView({
            revision: snapshot.registry.revision,
            zcodeBuiltinProviders: snapshot.config.zcodeBuiltinProviders,
            zcodeBuiltinProviderTemplates: snapshot.config.zcodeBuiltinProviderTemplates,
            personalProviders: snapshot.config.personalProviders,
            personalModels: snapshot.config.personalModels,
            resolution: snapshot.resolution,
            accountStates: snapshot.account.states,
        });
    }
    async refresh(reason) {
        if (this.#mutations?.refreshSources) {
            await this.#mutations.refreshSources(`settings:${reason}`);
        }
        else {
            await this.#source.refresh(reason);
        }
        return this.getView();
    }
    resolveModelConfig(input) {
        const snapshot = requireSnapshot(this.#source);
        const provider = requireEffectiveProvider(snapshot, input.providerId);
        if (!("personalConfig" in input)) {
            const modelRules = ModelConfigRules.composeEffective(snapshot.config.zcodeBuiltinModelRules, snapshot.config.personalModels);
            const config = modelRules.resolve({
                providerId: input.providerId,
                templateId: provider.templateId,
                modelId: input.modelId,
                apiType: provider.config.api?.type,
                baseUrl: provider.config.api?.baseUrl,
            });
            return Object.freeze({
                inheritedConfig: config.toJSON(),
                effectiveConfig: config.toJSON(),
                issues: Object.freeze([
                    ...config.validateComplete(["providers", input.providerId, "models", input.modelId]),
                ]),
            });
        }
        const personalConfig = parseModelConfig(input.personalConfig);
        const inheritedConfig = snapshot.config.zcodeBuiltinModelRules.resolve({
            providerId: input.providerId,
            templateId: provider.templateId,
            modelId: input.modelId,
            apiType: provider.config.api?.type,
            baseUrl: provider.config.api?.baseUrl,
        });
        let personalRules = snapshot.config.personalModels;
        if (input.originalModelId !== input.modelId) {
            personalRules = personalRules.renameExactModel(input.providerId, input.originalModelId, input.modelId);
        }
        // 此入口预览智能配置草稿；固定模式不请求推荐，重新开启时不能沿用旧固定标记。
        personalRules = personalRules.setExact(input.providerId, input.modelId, personalConfig, true);
        const config = ModelConfigRules.composeEffective(snapshot.config.zcodeBuiltinModelRules, personalRules).resolve({
            providerId: input.providerId,
            templateId: provider.templateId,
            modelId: input.modelId,
            apiType: provider.config.api?.type,
            baseUrl: provider.config.api?.baseUrl,
        });
        return Object.freeze({
            inheritedConfig: inheritedConfig.toJSON(),
            effectiveConfig: config.toJSON(),
            issues: Object.freeze([
                ...config.validateComplete(["providers", input.providerId, "models", input.modelId]),
            ]),
        });
    }
    onDidChange(listener) {
        return this.#source.onDidChange(() => listener(this.getView()));
    }
    createPersonalProvider(input) {
        return this.#mutateWithResult("create-provider", (target) => target.createPersonalProvider({
            ...(input?.templateId ? { templateId: input.templateId } : {}),
            ...(input?.providerName ? { providerName: input.providerName } : {}),
            ...(input?.locale ? { locale: input.locale } : {}),
            ...(input?.initialConfig
                ? { initialConfig: parseProviderConfig(input.initialConfig) }
                : {}),
        })).then(({ result, view }) => ({ providerId: result.providerId, view }));
    }
    savePersonalProviderOverlay(providerId, config, metadata) {
        return this.#mutateProvider(providerId, "save-provider", (target) => target.savePersonalProviderOverlay(providerId, parseProviderConfig(config), this.#modelMembership(providerId), metadata));
    }
    deletePersonalProvider(providerId) {
        return this.#mutateProvider(providerId, "delete-provider", (target) => target.deletePersonalProvider(providerId));
    }
    reorderPersonalProviders(providerIds) {
        return this.#mutate("reorder-providers", (target) => target.reorderPersonalProviders(providerIds));
    }
    reorderPersonalModels(providerId, modelIds) {
        return this.#mutateProvider(providerId, "reorder-models", (target) => target.reorderPersonalModels(providerId, modelIds, this.#modelMembership(providerId)));
    }
    addPersonalModel(providerId, modelId, config, useRecommendedConfig) {
        return this.#mutateProvider(providerId, "add-model", (target) => target.addPersonalModel(providerId, modelId, parseModelConfig(config), this.#modelMembership(providerId), useRecommendedConfig));
    }
    renamePersonalModel(providerId, currentModelId, nextModelId) {
        return this.#mutateProvider(providerId, "rename-model", (target) => target.renamePersonalModel(providerId, currentModelId, nextModelId, this.#modelMembership(providerId)));
    }
    deletePersonalModel(providerId, modelId) {
        return this.#mutateProvider(providerId, "delete-personal-model", (target) => target.deletePersonalModel(providerId, modelId, this.#modelMembership(providerId)));
    }
    savePersonalModelDraft(input) {
        return this.#mutateProvider(input.providerId, "save-model-draft", async (target) => {
            const snapshot = requireSnapshot(this.#source);
            if (snapshot.registry.revision !== input.basedOnRevision) {
                throw new Error(`Provider Settings revision conflict: expected ${input.basedOnRevision}, current ${snapshot.registry.revision}`);
            }
            const parsedConfig = parseModelConfig(input.personalConfig);
            await target.savePersonalModelDraft(input.providerId, input.originalModelId, input.nextModelId, parsedConfig, snapshot.config.personalRevision, input.useRecommendedConfig, this.#modelMembership(input.providerId, snapshot));
        });
    }
    setPersonalModelEnabled(providerId, modelId, enabled) {
        return this.#mutateProvider(providerId, "set-model-enabled", (target) => target.setPersonalModelEnabled(providerId, modelId, enabled, this.#modelMembership(providerId)));
    }
    #modelMembership(providerId, snapshot = requireSnapshot(this.#source)) {
        const provider = snapshot.resolution.resolvedProviders.find((item) => item.providerId === providerId);
        if (!provider)
            throw new Error(`Provider 不存在: ${providerId}`);
        // 配置成员与可执行模型不是同一名单：禁用、无权益和不完整模型仍可编辑。
        // Account 的空/替换名单也必须原样使用，不能再与静态 Built-in 取并集。
        return Object.freeze({
            providerId,
            inheritedModelIds: Object.freeze(provider.models.filter((model) => model.source === "builtin").map((model) => model.modelId)),
            personalRevision: snapshot.config.personalRevision,
            assertCurrent: () => {
                if (this.#source.getSnapshot() !== snapshot)
                    throw new Error("Provider Settings snapshot revision conflict");
            },
        });
    }
    async #mutate(reason, operation) {
        if (!this.#mutations)
            throw new Error("ProviderSettingsFacade 未配置写入目标");
        await operation(this.#mutations);
        await this.#mutations.refresh(`settings:${reason}`);
        return this.getView();
    }
    #mutateProvider(providerId, reason, operation) {
        const previous = this.#providerMutationTails.get(providerId) ?? Promise.resolve();
        const waitForPrevious = previous.catch(() => undefined);
        const result = waitForPrevious.then(() => this.#mutate(reason, operation));
        this.#providerMutationTails.set(providerId, result);
        const cleanup = () => {
            if (this.#providerMutationTails.get(providerId) === result) {
                this.#providerMutationTails.delete(providerId);
            }
        };
        void result.then(cleanup, cleanup);
        return result;
    }
    async waitForProviderOperations(providerId) {
        await this.#providerMutationTails.get(providerId);
    }
    async #mutateWithResult(reason, operation) {
        if (!this.#mutations)
            throw new Error("ProviderSettingsFacade 未配置写入目标");
        const result = await operation(this.#mutations);
        await this.#mutations.refresh(`settings:${reason}`);
        return { result, view: this.getView() };
    }
}
export class ModelSelectionFacade {
    #source;
    #classifyProvider;
    #resolveLegacyReasoningLevel;
    constructor(source, classifyProvider = () => "ordinary", resolveLegacyReasoningLevel) {
        this.#source = source;
        this.#classifyProvider = classifyProvider;
        this.#resolveLegacyReasoningLevel = resolveLegacyReasoningLevel;
    }
    getView(configuredDefault, revision, input) {
        // 账号事实与候选从同一已应用快照读取；不把最新 Settings 配给旧 Registry。
        const snapshot = input ? requireSnapshot(this.#source) : this.#source.getSnapshot();
        const registry = snapshot?.registry ?? this.#source.getView();
        const resolveLegacyReasoningLevel = snapshot && this.#resolveLegacyReasoningLevel
            ? (selection) => this.#resolveLegacyReasoningLevel(snapshot, selection)
            : undefined;
        // 默认偏好只归一化档位，不借此改写账号身份或保存配置。
        const normalizedDefault = configuredDefault && resolveLegacyReasoningLevel
            ? (resolveEffectiveModelSelection({
                selection: configuredDefault,
                registry,
                classifyProvider: () => "ordinary",
                resolveLegacyReasoningLevel,
            }).effectiveSelection ?? undefined)
            : configuredDefault;
        const initial = resolveInitialModelSelection({
            registry,
            configuredDefault: normalizedDefault,
        });
        return Object.freeze({
            revision: revision ?? registry.revision,
            providers: Object.freeze(registry.providers
                .filter((provider) => provider.config.visibility !== "hidden")
                .map(projectModelSelectionProviderView)),
            ...(initial.source === "none" ? {} : { preferredSelection: initial.selection }),
            ...(input
                ? resolveEffectiveModelSelection({
                    selection: input.selection,
                    registry,
                    accountStates: snapshot?.account.states,
                    classifyProvider: this.#classifyProvider,
                    resolveLegacyReasoningLevel,
                })
                : {}),
        });
    }
    onDidChange(listener) {
        return this.#source.onDidChange(() => listener(this.getView()));
    }
}
/** 把一个已进入 Registry 的 Provider 投影为标准模型选择候选。调用方负责产品作用域。 */
export function projectModelSelectionProviderView(provider) {
    return Object.freeze({
        providerId: provider.providerId,
        providerName: provider.providerName,
        templateId: provider.templateId,
        config: serializeRegistryProviderConfig(provider.config),
        models: Object.freeze(provider.models.map((model) => Object.freeze({
            modelId: model.modelId,
            config: serializeRegistryModelConfig(model.config),
        }))),
    });
}
function requireSnapshot(source) {
    const snapshot = source.getSnapshot();
    if (!snapshot)
        throw new Error("ProviderRegistryService 尚未 start()");
    return snapshot;
}
function requireEffectiveProvider(snapshot, providerId) {
    const provider = snapshot.resolution.effectiveProviders.getRule(providerId);
    if (!provider)
        throw new Error(`Provider 不存在: ${providerId}`);
    return provider;
}
function createProviderSettingsView(input) {
    const executableProviderIds = new Set(input.resolution.registryProviders.map((provider) => provider.providerId));
    const projectProvider = (provider) => {
        const personalConfig = input.personalProviders.get(provider.providerId);
        return Object.freeze({
            providerId: provider.providerId,
            providerName: provider.providerName,
            templateId: provider.templateId,
            enabled: provider.enabled,
            ...(input.accountStates?.[provider.providerId]
                ? { accountState: input.accountStates[provider.providerId] }
                : {}),
            executable: executableProviderIds.has(provider.providerId),
            ...(provider.templateConfig ? { templateConfig: provider.templateConfig.toJSON() } : {}),
            ...(provider.effectiveBuiltinConfig
                ? { effectiveBuiltinConfig: provider.effectiveBuiltinConfig.toJSON() }
                : {}),
            ...(personalConfig ? { personalConfig: personalConfig.toJSON() } : {}),
            effectiveConfig: provider.config.toJSON(),
            issues: provider.providerIssues,
            models: Object.freeze(provider.models.map((model) => {
                const personalModelConfig = input.personalModels.getExact(provider.providerId, model.modelId);
                const personalModelRule = input.personalModels.getExactRule(provider.providerId, model.modelId);
                return Object.freeze({
                    kind: model.kind,
                    modelId: model.modelId,
                    builtin: model.source === "builtin",
                    effectiveBuiltinConfig: model.effectiveBuiltinConfig.toJSON(),
                    ...(personalModelConfig ? { personalExactConfig: personalModelConfig.toJSON() } : {}),
                    ...(personalModelRule
                        ? { useRecommendedConfig: personalModelRule.type !== "manual-provider-model" }
                        : {}),
                    effectiveConfig: model.config.toJSON(),
                    enabled: model.enabled,
                    executable: model.executable,
                    selectable: model.selectable,
                    issues: model.issues,
                });
            })),
        });
    };
    const visibleProviders = input.resolution.resolvedProviders.filter((provider) => provider.config.visibility !== "hidden");
    const configuredProviders = visibleProviders;
    return Object.freeze({
        revision: input.revision,
        providerTemplates: Object.freeze((input.zcodeBuiltinProviderTemplates ?? ProviderTemplateMap.empty())
            .entries()
            .map(([templateId, template]) => Object.freeze({
            templateId,
            templateNameMap: template.templateNameMap,
            config: template.config.toJSON(),
        }))),
        providerOrder: Object.freeze(configuredProviders
            .filter((provider) => provider.config.group === "standard-personal")
            .map((provider) => provider.providerId)),
        providers: Object.freeze(configuredProviders.map(projectProvider)),
    });
}
//# sourceMappingURL=facades.js.map