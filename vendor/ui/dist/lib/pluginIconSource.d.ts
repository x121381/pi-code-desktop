/** 按完整身份解析客户端自有图标，避免商店、候选和消息各自维护不同例外。 */
export declare function resolvePluginIconSource(pluginId: string | undefined, icon?: string): string | undefined;
/** Session 投影已完成身份匹配；仅放行固定打包资源，不放宽任意本地 URL。 */
export declare function isTrustedPluginIconSource(icon: string | undefined): icon is string;
//# sourceMappingURL=pluginIconSource.d.ts.map