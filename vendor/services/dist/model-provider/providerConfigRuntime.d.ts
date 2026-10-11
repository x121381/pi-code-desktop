import { NodeProviderConfigRuntime, type PersonalProviderConfigRecoveryEvent, type NodeProviderConfigRuntimeOptions } from "@zcode/provider-node";
import type { ModelProviderConfig } from "./legacyModelProviderSerialized.js";
export interface ProviderConfigRuntimeOptions {
    readonly zcodeBuiltinFilePath: string;
    readonly zcodeBuiltinActiveFilePath?: string;
    readonly zcodeBuiltinRemote?: NodeProviderConfigRuntimeOptions["zcodeBuiltinRemote"];
    readonly zcodeBuiltinEnvironment?: NodeProviderConfigRuntimeOptions["zcodeBuiltinEnvironment"];
    readonly onZCodeBuiltinRefreshError?: (error: unknown) => void;
    readonly onPersonalConfigRecovery?: (event: PersonalProviderConfigRecoveryEvent) => void;
    readonly onPersonalConfigPollingError?: (error: unknown) => void;
    readonly personalFilePath?: string;
    readonly personalPollingIntervalMs?: number | false;
    readonly readLegacyProviders?: () => Promise<readonly ModelProviderConfig[]>;
    readonly watch?: boolean;
}
/**
 * Services 装配层：提供 App 配置目录和已发布旧配置的一次性迁移入口。
 * 配置迁移保留 ZCode 用户的供应商数据，文件运行时由 @zcode/provider-node 唯一实现。
 */
export declare class ProviderConfigRuntime {
    #private;
    readonly configService: NodeProviderConfigRuntime["configService"];
    constructor(options: ProviderConfigRuntimeOptions);
    start(): Promise<void>;
    get personalRepository(): NodeProviderConfigRuntime["personalRepository"];
    resolveZCodeBuiltinActiveFilePath(): Promise<string>;
    refreshZCodeBuiltin(options?: {
        readonly force?: boolean;
    }): Promise<import("@zcode/provider-node").ZCodeBuiltinRefreshResult>;
    onDidCheckZCodeBuiltin(listener: () => Promise<void>): () => void;
    dispose(): void;
}
export declare function createProviderConfigRuntime(options: ProviderConfigRuntimeOptions): ProviderConfigRuntime;
//# sourceMappingURL=providerConfigRuntime.d.ts.map