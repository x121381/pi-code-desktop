import type { Hook, ZCodeInstalledPluginSummary, ZCodePluginInfo } from "@zcode/shared";
import { type HookScope, type PluginHookRow } from "./HooksList.js";
interface HooksSectionProps {
    workspacePath?: string | null;
    workspaceIdentity?: string;
}
export declare function isReadOnlyZCodeHook(hook: Hook): boolean;
/**
 * workspace-hook-trust：解析「最新 review binding」对应的 scope 切换目标。
 * 纯函数（供 HooksSection 与单测共用）：
 * - 按 request.createdAt 取最新 binding（同一 runtime flow 的 generation 递增也会
 *   刷新 createdAt，语义是「最新出现的审核」）；
 * - identity 优先精确匹配 tab 的 scope key；无 identity 的旧本地 binding 才按
 *   workspacePath 回退（与 matchesWorkspaceBinding 的降级规则一致）；
 * - 找不到对应 tab（workspace 已关闭/未知）返回 null——调用方不得切过去。
 */
export declare function resolveLatestReviewScopeTarget(bindings: Record<string, {
    request: {
        interactionId: string;
        createdAt: number;
        workspaceIdentity?: string;
    };
    workspacePath: string;
}>, workspaceTabs: readonly {
    workspacePath: string;
    workspaceIdentity?: string;
}[]): {
    interactionId: string;
    scopeKey: string;
} | null;
export declare function buildPluginHookRows(plugins: readonly Pick<ZCodePluginInfo, "enabled" | "hookDetails" | "id" | "name">[], installedPlugins: readonly Pick<ZCodeInstalledPluginSummary, "id" | "scope">[], scopeMetadataKnown: boolean): PluginHookRow[];
export declare function filterPluginHooksByScope(pluginHooks: readonly PluginHookRow[], scope: HookScope): PluginHookRow[];
export declare function HooksSection({ workspacePath, workspaceIdentity }: HooksSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=HooksSection.d.ts.map