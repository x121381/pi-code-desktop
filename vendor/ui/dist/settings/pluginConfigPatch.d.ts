import type { ZCodePluginInfo } from "@zcode/shared";
export type PluginOptionDraftValue = string | number | boolean | null;
export interface PluginConfigPatch {
    options: Record<string, string | number | boolean>;
    clearOptionKeys: string[];
}
/**
 * 构造 Plugin 配置写入 patch。
 *
 * `configuredOptions` 是当前 scope 的 effective 值，不能在保存时当作整份 draft
 * 写回；否则 Workspace 页面只修改一个字段，也会把 User/default 的其它字段固化成
 * Workspace override。只有明确产生 draft 的字段才属于本次写入。
 */
export declare function buildPluginConfigPatch(plugin: Pick<ZCodePluginInfo, "userConfig">, drafts: Record<string, PluginOptionDraftValue | undefined>): PluginConfigPatch;
//# sourceMappingURL=pluginConfigPatch.d.ts.map