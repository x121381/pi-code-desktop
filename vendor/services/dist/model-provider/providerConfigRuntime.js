import { join } from "node:path";
import { NodeProviderConfigRuntime, PERSONAL_PROVIDER_CONFIG_FILE_NAME, } from "@zcode/provider-node";
import { getAppConfigDir } from "../paths.js";
import { importLegacyPersonalProviderConfig } from "./legacyPersonalProviderConfigImporter.js";
/**
 * Services 装配层：提供 App 配置目录和已发布旧配置的一次性迁移入口。
 * 配置迁移保留 ZCode 用户的供应商数据，文件运行时由 @zcode/provider-node 唯一实现。
 */
export class ProviderConfigRuntime {
    configService;
    #runtime;
    constructor(options) {
        const runtimeOptions = {
            zcodeBuiltinFilePath: options.zcodeBuiltinFilePath,
            zcodeBuiltinActiveFilePath: options.zcodeBuiltinActiveFilePath,
            zcodeBuiltinRemote: options.zcodeBuiltinRemote,
            zcodeBuiltinEnvironment: options.zcodeBuiltinEnvironment,
            onZCodeBuiltinRefreshError: options.onZCodeBuiltinRefreshError,
            onPersonalConfigRecovery: options.onPersonalConfigRecovery,
            onPersonalConfigPollingError: options.onPersonalConfigPollingError,
            personalFilePath: options.personalFilePath ?? join(getAppConfigDir(), PERSONAL_PROVIDER_CONFIG_FILE_NAME),
            personalPollingIntervalMs: options.personalPollingIntervalMs,
            watch: options.watch,
            ...(options.readLegacyProviders
                ? {
                    importLegacy: async () => importLegacyPersonalProviderConfig({
                        legacyProviders: await options.readLegacyProviders(),
                    }),
                }
                : {}),
        };
        this.#runtime = new NodeProviderConfigRuntime(runtimeOptions);
        this.configService = this.#runtime.configService;
    }
    start() {
        return this.#runtime.start();
    }
    get personalRepository() {
        return this.#runtime.personalRepository;
    }
    resolveZCodeBuiltinActiveFilePath() {
        return this.#runtime.resolveZCodeBuiltinActiveFilePath();
    }
    refreshZCodeBuiltin(options) {
        return this.#runtime.refreshZCodeBuiltin(options);
    }
    onDidCheckZCodeBuiltin(listener) {
        return this.#runtime.onDidCheckZCodeBuiltin(listener);
    }
    dispose() {
        this.#runtime.dispose();
    }
}
export function createProviderConfigRuntime(options) {
    return new ProviderConfigRuntime(options);
}
//# sourceMappingURL=providerConfigRuntime.js.map