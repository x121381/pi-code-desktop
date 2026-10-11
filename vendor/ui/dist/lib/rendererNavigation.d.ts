export interface RendererNavigationEntry {
    readonly type?: string;
}
/**
 * 区分 app 冷启动与同一 renderer 的刷新。
 * workspace/app 入口只应展示草稿，但输出中的 renderer reload 仍要恢复当前 pane 续流。
 */
export declare function isRendererReloadNavigation(entries?: readonly RendererNavigationEntry[]): boolean;
//# sourceMappingURL=rendererNavigation.d.ts.map