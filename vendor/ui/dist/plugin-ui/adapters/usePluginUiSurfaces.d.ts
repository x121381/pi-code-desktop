import type { PluginUiSurfaceEntry } from "@zcode/services";
export interface UsePluginUiSurfacesInput {
    workspacePath: string;
    workspaceIdentity?: string;
    /** false 时不拉取（无会话 / 平台不支持），返回空数组。 */
    enabled?: boolean;
}
/**
 * 工作区级面板入口（）：经桥读 `plugins/listUiSurfaces`。
 * 刷新信号复用插件设置页的 store：`installedPlugins` 的 id+enabled 指纹变化（安装 / 卸载 / 启停）即重新拉取；
 * 不再另起事件通道，也不缓存跨 workspace。
 */
export declare function usePluginUiSurfaces(input: UsePluginUiSurfacesInput): PluginUiSurfaceEntry[];
/** 清单 title 可为 locale → string；按 locale、语言前缀、en、任一值顺序取。 */
export declare function resolvePluginUiSurfaceTitle(title: PluginUiSurfaceEntry["title"], locale: string): string;
//# sourceMappingURL=usePluginUiSurfaces.d.ts.map