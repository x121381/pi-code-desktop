import { type PaneBinding, type PaneLayoutSnapshot, type PaneSplitSide, type PaneWorkspaceScope, type SplitDirection } from "@/v4/paneLayoutTree.js";
/** 冷启动入口用：识别并清理上一次 renderer 留下、但本次不应恢复的布局。 */
export declare function hadPersistedPaneLayoutAtModuleLoad(): boolean;
export * from "@/v4/paneLayoutTree.js";
export * from "@/v4/paneLayoutPersistence.js";
export interface PaneLayoutStore extends PaneLayoutSnapshot {
    /** 在 anchor pane 处拆分出 draft pane（绑 scope，首发 createSession 后原地绑定）。 */
    splitPane: (anchorPaneId: string, direction: SplitDirection, scope: PaneWorkspaceScope) => void;
    /** 在 anchor pane 四周拆出已绑定 session 的 pane（draft drop / 非 group 拖拽入口）。 */
    splitPaneWithBinding: (anchorPaneId: string, side: PaneSplitSide, binding: PaneBinding) => void;
    /** 侧栏/下钻入口：已开 → 聚焦；否则焦点 pane 向右拆分并绑定 session。 */
    openSessionInNewPane: (scope: PaneWorkspaceScope, sessionId: string) => void;
    /** draft 临时布局：普通 sidebar 点击只替换 focused secondary，不覆盖 primary draft。 */
    replacePaneBinding: (paneId: string, binding: PaneBinding) => void;
    closePane: (paneId: string) => void;
    focusPane: (paneId: string) => void;
    bindPaneSession: (paneId: string, sessionId: string) => void;
    setSplitRatio: (splitId: string, ratio: number) => void;
    confirmRestoredPaneSession: (paneId: string) => void;
    /** 新建任务/草稿时退出分屏显示，回到单 primary panel。 */
    resetToPrimaryPane: () => void;
}
/** 每窗口一份；action 引用稳定，可直接下发给 memo 组件。 */
export declare const usePaneLayoutStore: import("zustand").UseBoundStore<import("zustand").StoreApi<PaneLayoutStore>>;
//# sourceMappingURL=paneLayoutStore.d.ts.map