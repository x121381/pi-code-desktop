import { ProviderConfigMap, ProviderTemplateMap, type ModelConfigRules } from "./config/index.js";
import type { AccountProviderStates } from "./account-provider-state.js";
export interface ProviderSource<TSnapshot> {
    read(): Promise<TSnapshot>;
    onDidChange(listener: (reason: string) => void): () => void;
}
export interface ProviderConfigSnapshot {
    readonly revision: string;
    readonly zcodeBuiltinRevision: string;
    readonly personalRevision: string;
    readonly zcodeBuiltinProviders: ProviderConfigMap;
    readonly zcodeBuiltinProviderTemplates: ProviderTemplateMap;
    readonly personalProviders: ProviderConfigMap;
    readonly zcodeBuiltinModelRules: ModelConfigRules;
    readonly personalModels: ModelConfigRules;
    readonly personalProviderOrder?: readonly string[];
}
export interface AccountProviderConfigSnapshot {
    readonly revision: string;
    readonly basedOnZCodeBuiltinRevision: string;
    readonly providers: ProviderConfigMap;
    readonly states?: AccountProviderStates;
}
/** 首次 Account 事实尚未到达时，基于当前 Built-in 生成可发布的 fail-closed Overlay。 */
export declare function createFailClosedAccountProviderConfigSnapshot(config: ProviderConfigSnapshot): AccountProviderConfigSnapshot;
export declare function createAccountProviderConfigSnapshot(basedOnZCodeBuiltinRevision: string, providers: ProviderConfigMap, states?: AccountProviderStates): AccountProviderConfigSnapshot;
/**
 * 由进程外围适配器更新的账号 Provider 可用范围。
 *
 * Source 只保存账号状态投影出的第三层 Provider Config Overlay。
 * models 是账号权益约束；Token、API Key、Header 与账号身份不得写入 Config。
 */
export declare class MutableAccountProviderConfigSource implements ProviderSource<AccountProviderConfigSnapshot> {
    #private;
    read(): Promise<AccountProviderConfigSnapshot>;
    onDidChange(listener: (reason: string) => void): () => void;
    replace(snapshot: AccountProviderConfigSnapshot, reason?: string): boolean;
}
//# sourceMappingURL=sources.d.ts.map