import { ProviderConfigMap } from "./config/index.js";
import type { AccountProviderStates } from "./account-provider-state.js";
import { type AccountProviderConfigSnapshot, type ProviderConfigSnapshot, type ProviderSource } from "./sources.js";
export interface AccountProviderResolveInput {
    readonly configRevision: string;
    readonly configuredProviders: ProviderConfigMap;
    readonly previousProviders: ProviderConfigMap;
    readonly previousStates?: AccountProviderStates;
    readonly reasons?: readonly string[];
}
export type AccountProviderResolver = (input: AccountProviderResolveInput) => Promise<{
    readonly providers: ProviderConfigMap;
    readonly states: AccountProviderStates;
}>;
export interface AccountProviderServiceDependencies {
    readonly configSource: ProviderSource<ProviderConfigSnapshot>;
    readonly resolve: AccountProviderResolver;
}
export interface AccountProviderServiceRefreshErrorEvent {
    readonly error: unknown;
    readonly reasons: readonly string[];
}
/**
 * 维护当前账号状态投影出的第三层 Provider Config Overlay。
 *
 * 该服务只编排 Config Source、刷新与 last-known-good 发布；登录、权益和团队连接
 * 的具体查询由外围 Resolver 注入，因此本包不依赖文件、网络或 OAuth 实现。
 */
export declare class AccountProviderService implements ProviderSource<AccountProviderConfigSnapshot> {
    #private;
    constructor(dependencies: AccountProviderServiceDependencies);
    read(): Promise<AccountProviderConfigSnapshot>;
    refresh(reason?: string): Promise<AccountProviderConfigSnapshot>;
    onDidChange(listener: (reason: string) => void): () => void;
    onDidRefreshError(listener: (event: AccountProviderServiceRefreshErrorEvent) => void): () => void;
    dispose(): void;
}
//# sourceMappingURL=account-provider-service.d.ts.map