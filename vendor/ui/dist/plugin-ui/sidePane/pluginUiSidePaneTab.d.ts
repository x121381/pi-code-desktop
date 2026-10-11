import type { WorkspaceSidePaneState } from "@/lib/workspaceSidePane.js";
import type { OpenPluginUiSideTabRequest, PluginUiSidePaneTab } from "../contract.js";
export type OpenScopedPluginUiSideTabRequest = OpenPluginUiSideTabRequest & {
    workspaceKey: string;
};
/**
 * 与 plan-detail 同构：按 workspaceKey + parentSessionId + 作用域派生稳定 id。
 * 工具卡片 `…:<toolCallId>`；面板 `…:surface:<surfaceId>`（面板 id 与 toolCallId 不同命名空间，前缀防撞）。
 */
export declare function createPluginUiSidePaneTab(options: OpenScopedPluginUiSideTabRequest): PluginUiSidePaneTab;
/** 同一作用域只保留一个 tab；重复打开只刷新标题并激活。 */
export declare function openPluginUiSidePane(current: WorkspaceSidePaneState | null, options: OpenScopedPluginUiSideTabRequest): WorkspaceSidePaneState;
//# sourceMappingURL=pluginUiSidePaneTab.d.ts.map