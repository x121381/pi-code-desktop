import { ProviderConfig, ProviderConfigMap, ProviderTemplateMap, ZhipuAccountAccessConfig, } from "./config/index.js";
/** 首次 Account 事实尚未到达时，基于当前 Built-in 生成可发布的 fail-closed Overlay。 */
export function createFailClosedAccountProviderConfigSnapshot(config) {
    const unentitledProviders = new ProviderConfigMap(config.zcodeBuiltinProviders.entries().flatMap(([providerId, provider]) => provider.access?.type === "zhipu-account"
        ? [
            [
                providerId,
                new ProviderConfig({
                    access: new ZhipuAccountAccessConfig({ entitled: false }),
                }),
            ],
        ]
        : []));
    return createAccountProviderConfigSnapshot(config.zcodeBuiltinRevision, unentitledProviders);
}
export function createAccountProviderConfigSnapshot(basedOnZCodeBuiltinRevision, providers, states) {
    return Object.freeze({
        revision: `account:${JSON.stringify([basedOnZCodeBuiltinRevision, providers.toJSON(), states])}`,
        basedOnZCodeBuiltinRevision,
        providers,
        ...(states ? { states } : {}),
    });
}
const EMPTY_ACCOUNT_PROVIDER_CONFIG_SNAPSHOT = Object.freeze({
    revision: "empty-account-config-v1",
    basedOnZCodeBuiltinRevision: "uninitialized",
    providers: ProviderConfigMap.empty(),
});
/**
 * 由进程外围适配器更新的账号 Provider 可用范围。
 *
 * Source 只保存账号状态投影出的第三层 Provider Config Overlay。
 * models 是账号权益约束；Token、API Key、Header 与账号身份不得写入 Config。
 */
export class MutableAccountProviderConfigSource {
    #listeners = new Set();
    #snapshot = EMPTY_ACCOUNT_PROVIDER_CONFIG_SNAPSHOT;
    async read() {
        return this.#snapshot;
    }
    onDidChange(listener) {
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }
    replace(snapshot, reason = "replace") {
        if (snapshot.revision === this.#snapshot.revision)
            return false;
        this.#snapshot = freezeAccountProviderConfigSnapshot(snapshot);
        for (const listener of this.#listeners)
            listener(reason);
        return true;
    }
}
function freezeAccountProviderConfigSnapshot(snapshot) {
    return Object.freeze({
        revision: snapshot.revision,
        basedOnZCodeBuiltinRevision: snapshot.basedOnZCodeBuiltinRevision,
        providers: snapshot.providers,
        ...(snapshot.states ? { states: snapshot.states } : {}),
    });
}
//# sourceMappingURL=sources.js.map