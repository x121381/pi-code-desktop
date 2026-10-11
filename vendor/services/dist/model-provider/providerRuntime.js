import { NodeModelSelectionConfigRepository, createNodeModelSelectionFacade, } from "@zcode/provider-node";
import { ProviderRegistryService, ProviderSettingsFacade, createFailClosedAccountProviderConfigSnapshot, } from "@zcode/provider";
import { createProviderConfigRuntime, } from "./providerConfigRuntime.js";
import { createModelSelectionService, createProviderSettingsService, } from "./providerFacadeServices.js";
/**
 * 普通 API Provider 可以在账号能力尚未装配时独立运行。
 * Account Provider 由当前 Built-in revision 对齐的 access.entitled=false Overlay 显式 fail-closed。
 */
export class EmptyAccountProviderConfigSource {
    configSource;
    constructor(configSource) {
        this.configSource = configSource;
    }
    async read() {
        return createFailClosedAccountProviderConfigSnapshot(await this.configSource.read());
    }
    onDidChange() {
        return () => { };
    }
}
/** 组装一个进程内共享的 Provider Config、Registry 与 Facade。 */
export class ProviderRuntime {
    configService;
    registryService;
    providerSettings;
    modelSelection;
    #configRuntime;
    #disposeAccountSource;
    #disposeBuiltinRecovery;
    #modelSelectionRuntime;
    #disposeModelSelectionConfiguredDefaultSource;
    #startPromise = null;
    #disposed = false;
    constructor(dependencies) {
        this.#configRuntime = dependencies.configRuntime;
        this.#disposeAccountSource = dependencies.disposeAccountSource;
        this.#disposeModelSelectionConfiguredDefaultSource =
            dependencies.disposeModelSelectionConfiguredDefaultSource;
        this.configService = this.#configRuntime.configService;
        const accountSource = dependencies.accountSource ?? new EmptyAccountProviderConfigSource(this.configService);
        this.#disposeBuiltinRecovery = this.#configRuntime.onDidCheckZCodeBuiltin(async () => {
            const [config, account] = await Promise.all([
                this.configService.read(),
                accountSource.read(),
            ]);
            if (!this.#disposed && config.zcodeBuiltinRevision !== account.basedOnZCodeBuiltinRevision) {
                await accountSource.refresh?.("builtin-account-recovery");
            }
        });
        this.registryService = new ProviderRegistryService({
            configSource: this.configService,
            accountSource,
        });
        const mutations = createSettingsMutationTarget(this.#configRuntime, this.registryService, accountSource);
        const ensureReady = () => this.start();
        const settingsFacade = new ProviderSettingsFacade(this.registryService, mutations);
        this.providerSettings = createProviderSettingsService(settingsFacade, ensureReady, dependencies.testConnectivity);
        this.#modelSelectionRuntime = createModelSelectionService(createNodeModelSelectionFacade(this.registryService), ensureReady, dependencies.modelSelectionConfiguredDefaultSource);
        this.modelSelection = this.#modelSelectionRuntime;
    }
    start() {
        if (this.#disposed)
            throw new Error("ProviderRuntime 已 dispose");
        if (this.#startPromise)
            return this.#startPromise;
        const startPromise = this.#configRuntime.start().then(() => this.registryService.start());
        this.#startPromise = startPromise;
        void startPromise.catch(() => {
            if (this.#startPromise === startPromise)
                this.#startPromise = null;
        });
        return startPromise;
    }
    dispose() {
        if (this.#disposed)
            return;
        this.#disposed = true;
        this.#disposeBuiltinRecovery();
        this.#modelSelectionRuntime.dispose();
        this.registryService.dispose();
        this.#disposeAccountSource?.();
        this.#disposeModelSelectionConfiguredDefaultSource?.();
        this.#configRuntime.dispose();
    }
}
function createSettingsMutationTarget(configRuntime, registryService, accountSource) {
    const configService = configRuntime.configService;
    return {
        createPersonalProvider: (input) => configService.createPersonalProvider(input),
        savePersonalProviderOverlay: (providerId, config, membership, metadata) => configService.savePersonalProviderOverlay(providerId, config, membership, metadata),
        deletePersonalProvider: (providerId) => configService.deletePersonalProvider(providerId),
        reorderPersonalProviders: (providerIds) => configService.reorderPersonalProviders(providerIds),
        reorderPersonalModels: (providerId, modelIds, membership) => configService.reorderPersonalModels(providerId, modelIds, membership),
        // 手工四参数转发曾丢掉新增的配置模式；直接绑定完整签名，避免装配层截断写入意图。
        addPersonalModel: configService.addPersonalModel.bind(configService),
        renamePersonalModel: (providerId, currentModelId, nextModelId, membership) => configService.renamePersonalModel(providerId, currentModelId, nextModelId, membership),
        deletePersonalModel: (providerId, modelId, membership) => configService.deletePersonalModel(providerId, modelId, membership),
        setPersonalModelEnabled: (providerId, modelId, enabled, membership) => configService.setPersonalModelEnabled(providerId, modelId, enabled, membership),
        savePersonalModelDraft: (providerId, originalModelId, nextModelId, config, expectedPersonalRevision, useRecommendedConfig, membership) => configService.savePersonalModelDraft(providerId, originalModelId, nextModelId, config, expectedPersonalRevision, useRecommendedConfig, membership),
        refresh: (reason) => registryService.refresh(reason),
        refreshSources: async (reason) => {
            const sourceResults = await Promise.allSettled([
                configRuntime.refreshZCodeBuiltin({ force: true }),
                accountSource.refresh?.(reason) ?? Promise.resolve(),
            ]);
            const snapshot = await registryService.refresh(reason);
            const failed = sourceResults.find((result) => result.status === "rejected");
            if (failed)
                throw failed.reason;
            return snapshot;
        },
    };
}
export function createProviderRuntime(options) {
    const { accountSource, testConnectivity, ...configRuntimeOptions } = options;
    const configRuntime = createProviderConfigRuntime(configRuntimeOptions);
    const modelSelectionConfiguredDefaultSource = new NodeModelSelectionConfigRepository({
        personalRepository: configRuntime.personalRepository,
    });
    return createProviderRuntimeFromConfigRuntime({
        configRuntime,
        accountSource,
        testConnectivity,
        modelSelectionConfiguredDefaultSource,
        disposeModelSelectionConfiguredDefaultSource: () => modelSelectionConfiguredDefaultSource.dispose(),
    });
}
export function createProviderRuntimeFromConfigRuntime(dependencies) {
    return new ProviderRuntime(dependencies);
}
//# sourceMappingURL=providerRuntime.js.map