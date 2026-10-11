import { ServiceChannels } from "@zcode/shared";
import {} from "@zcode/provider";
import { createServiceDescriptor } from "../descriptors.js";
import { createServiceLogger } from "../logger/serviceLogger.js";
export const IProviderSettingsService = createServiceDescriptor(ServiceChannels.ProviderSettings);
export const IModelSelectionService = createServiceDescriptor(ServiceChannels.ModelSelection);
export function createProviderSettingsService(facade, ensureReady = async () => { }, testConnectivity) {
    return {
        onDidChange: toEvent((listener) => facade.onDidChange(listener)),
        getView: async () => {
            await ensureReady();
            return facade.getView();
        },
        refresh: async (reason) => {
            await ensureReady();
            return facade.refresh(reason);
        },
        createPersonalProvider: async (input) => {
            await ensureReady();
            return facade.createPersonalProvider(input);
        },
        resolveModelConfig: async (input) => {
            await ensureReady();
            return facade.resolveModelConfig(input);
        },
        savePersonalProviderOverlay: async (providerId, config, metadata) => {
            await ensureReady();
            return facade.savePersonalProviderOverlay(providerId, config, metadata);
        },
        deletePersonalProvider: async (providerId) => {
            await ensureReady();
            return facade.deletePersonalProvider(providerId);
        },
        reorderPersonalProviders: async (providerIds) => {
            await ensureReady();
            return facade.reorderPersonalProviders(providerIds);
        },
        reorderPersonalModels: async (providerId, modelIds) => {
            await ensureReady();
            return facade.reorderPersonalModels(providerId, modelIds);
        },
        addPersonalModel: async (providerId, modelId, config, useRecommendedConfig) => {
            await ensureReady();
            return facade.addPersonalModel(providerId, modelId, config, useRecommendedConfig);
        },
        renamePersonalModel: async (providerId, currentModelId, nextModelId) => {
            await ensureReady();
            return facade.renamePersonalModel(providerId, currentModelId, nextModelId);
        },
        deletePersonalModel: async (providerId, modelId) => {
            await ensureReady();
            return facade.deletePersonalModel(providerId, modelId);
        },
        savePersonalModelDraft: async (input) => {
            await ensureReady();
            return facade.savePersonalModelDraft(input);
        },
        setPersonalModelEnabled: async (providerId, modelId, enabled) => {
            await ensureReady();
            return facade.setPersonalModelEnabled(providerId, modelId, enabled);
        },
        testModelConnectivity: async (input) => {
            await ensureReady();
            if (!testConnectivity) {
                throw new Error("当前 Environment 未装配模型连通性测试能力");
            }
            await facade.waitForProviderOperations(input.providerId);
            // 禁用对象仍存在于配置视图，但不进入执行 Registry；不能把未发布误报成配置丢失。
            // 只消费操作完成后的公共资格，不另查 Key、权益，也不替代目标 Environment 最终校验。
            const provider = facade
                .getView()
                .providers.find((item) => item.providerId === input.providerId);
            const model = provider?.models.find((item) => item.modelId === input.modelId);
            const unavailable = !provider || !provider.enabled
                ? "provider-unavailable"
                : !model || !model.enabled || model.issues.length > 0
                    ? "model-unavailable"
                    : !provider.executable
                        ? "provider-unavailable"
                        : !model.executable
                            ? "model-unavailable"
                            : undefined;
            if (unavailable) {
                return {
                    success: false,
                    error: {
                        code: unavailable,
                        message: unavailable === "provider-unavailable"
                            ? "This provider is currently unavailable for connectivity testing."
                            : "This model is currently unavailable for connectivity testing.",
                    },
                };
            }
            return testConnectivity({
                workspacePath: input.workspacePath,
                ...(input.workspaceIdentity ? { workspaceIdentity: input.workspaceIdentity } : {}),
                providerId: input.providerId,
                modelId: input.modelId,
            });
        },
    };
}
export function createModelSelectionService(facade, ensureReady = async () => { }, configuredDefaultSource) {
    const log = createServiceLogger("model-selection");
    let revision = 0;
    let disposed = false;
    const listeners = new Set();
    const getView = async (input) => {
        await ensureReady();
        if (disposed)
            throw new Error("ModelSelectionService 已 dispose");
        const configuredDefault = await configuredDefaultSource?.read();
        if (disposed)
            throw new Error("ModelSelectionService 已 dispose");
        const base = facade.getView(configuredDefault);
        if (revision < base.revision)
            revision = base.revision;
        return facade.getView(configuredDefault, revision, input);
    };
    const emit = () => {
        if (disposed)
            return;
        revision += 1;
        void getView().then((view) => {
            if (disposed)
                return;
            for (const listener of listeners)
                listener(view);
        }, (error) => {
            // Registry 事件触发的异步 View 重建没有 owner；Host dispose 后它仍会继续
            // 读取已释放的配置仓库，并形成未处理 rejection。dispose 是明确的取消边界；仅在服务
            // 仍存活时记录真实读取失败。
            if (disposed)
                return;
            log.warn(undefined, `ModelSelection View 刷新失败: ${String(error)}`);
        });
    };
    const disposeFacade = facade.onDidChange(emit);
    const disposeConfiguredDefault = configuredDefaultSource?.onDidChange?.(emit);
    return {
        onDidChange: (listener) => {
            listeners.add(listener);
            return { dispose: () => listeners.delete(listener) };
        },
        getView,
        dispose() {
            if (disposed)
                return;
            disposed = true;
            disposeFacade();
            disposeConfiguredDefault?.();
            listeners.clear();
        },
    };
}
function toEvent(subscribe) {
    return (listener) => {
        const dispose = subscribe(listener);
        return { dispose };
    };
}
//# sourceMappingURL=providerFacadeServices.js.map