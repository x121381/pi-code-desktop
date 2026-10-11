/**
 * 同一作用域同时只保留一个活 sandbox。
 * 键为 `buildPluginUiSurfaceKey(target, scope)`，统一隔离 workspace/session/plugin。
 * 侧栏打开时内联卡片显示占位；带 `display.ui.surface` 的工具结果据此判断面板是否已在本会话打开（R4 路由）。
 * 这里只记录"谁在渲染"，不持有任何沙箱状态。渲染进程内存，不持久化。
 */
export type PluginUiSurface = "inline" | "side-pane";
export declare function claimPluginUiSurface(key: string, surface: PluginUiSurface): () => void;
export declare function getPluginUiSurface(key: string): PluginUiSurface | null;
export declare function subscribePluginUiSurfaces(listener: () => void): () => void;
/** 测试用：清空全部记录。 */
export declare function resetPluginUiSurfacesForTest(): void;
//# sourceMappingURL=pluginUiSurfaceStore.d.ts.map