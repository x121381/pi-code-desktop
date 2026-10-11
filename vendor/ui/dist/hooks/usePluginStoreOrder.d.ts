/** 只持有当前页面投影；请求合并与 TTL 统一归 Host 配置服务管理。 */
export declare function usePluginStoreOrder(enabled?: boolean): {
    order: {
        code?: {
            categoryOrder?: string[] | undefined;
            pluginOrder?: Record<string, string[]> | undefined;
        } | undefined;
        work?: {
            categoryOrder?: string[] | undefined;
            pluginOrder?: Record<string, string[]> | undefined;
        } | undefined;
    } | null;
    refresh: (forceRefresh?: boolean) => Promise<void>;
};
//# sourceMappingURL=usePluginStoreOrder.d.ts.map