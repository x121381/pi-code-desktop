export interface SettingUpdatedEvent {
    readonly keys: readonly string[];
}
interface AccountProviderInvalidationOptions {
    readonly onDidUpdateSetting: (listener: (event: SettingUpdatedEvent) => void) => () => void;
    readonly refresh: (reason: string) => Promise<unknown>;
}
/**
 * 把会改变账号连接选择的 Settings 变化收敛为 AccountProviderService 刷新。
 *
 * OAuth 登录、登出和购买完成由对应业务流程直接刷新 Account Source；这里不再
 * 订阅已退役旧 Registry 的事件，避免重新引入并行事实源。
 */
export declare function bindAccountProviderInvalidation(options: AccountProviderInvalidationOptions): () => void;
export {};
//# sourceMappingURL=accountProviderInvalidation.d.ts.map