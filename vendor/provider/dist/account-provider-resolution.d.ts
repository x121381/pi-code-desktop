import { ProviderConfigMap, type ModelId, type ProviderId } from "./config/index.js";
import type { AccountProviderResolveInput, AccountProviderResolver } from "./account-provider-service.js";
import type { AccountProviderUnavailableReason } from "./account-provider-state.js";
export type AccountProviderConnectionResult = {
    /** 账号/组织身份变化后禁止沿用旧快照；仅用于本轮解析，不进入配置。 */
    readonly resetPrevious?: boolean;
    readonly current?: boolean;
    readonly connectionKey?: string;
    readonly effectiveAt?: number;
} & ({
    readonly providerId: ProviderId;
    readonly status: "available" | "pending";
    readonly models?: readonly ModelId[];
} | {
    readonly providerId: ProviderId;
    readonly status: "unavailable" | "unknown";
    /** 仅在 status === "unavailable" 时携带；unknown 表示本轮无法判定原因。 */
    readonly unavailableReason?: AccountProviderUnavailableReason;
});
export interface ResolveAccountProviderConfigsInput {
    readonly configuredProviders: ProviderConfigMap;
    readonly previousProviders: ProviderConfigMap;
    readonly connections: readonly AccountProviderConnectionResult[];
}
export type AccountProviderConnectionResolver = (input: Omit<AccountProviderResolveInput, "previousProviders">) => Promise<readonly AccountProviderConnectionResult[]>;
export declare function createAccountProviderConfigResolver(resolveConnections: AccountProviderConnectionResolver): AccountProviderResolver;
/** 把账号连接结果转换为 Registry 使用的第三层 Account Provider Config。 */
export declare function resolveAccountProviderConfigs(input: ResolveAccountProviderConfigsInput): ProviderConfigMap;
//# sourceMappingURL=account-provider-resolution.d.ts.map