import { type RemoteTarget, type TabId, type TabState, type WorkspacePurpose } from "@zcode/shared";
export declare const SETTINGS_TAB_ID = "__settings__";
export type WorkspaceAvailability = "available" | "unavailable-local-directory";
export interface SettingsTabState {
    id: typeof SETTINGS_TAB_ID;
    kind: "settings";
    label: "settings";
}
export interface WorkspaceTabState extends TabState {
    kind: "workspace";
    /** 启动期一次性校验结果；不持久化，运行期间不重检。 */
    availability?: WorkspaceAvailability;
    remoteSessionId?: string;
    remoteTarget?: RemoteTarget;
    remoteHistoryId?: string;
    workspaceIdentity?: string;
    localWorkspacePath?: string;
    workspacePurpose?: WorkspacePurpose;
}
export interface WorkspaceTabOptions {
    availability?: WorkspaceAvailability;
    remoteSessionId?: string;
    remoteTarget?: RemoteTarget;
    remoteHistoryId?: string;
    workspaceIdentity?: string;
    localWorkspacePath?: string;
    workspacePurpose?: WorkspacePurpose;
}
export interface RestorableWorkspaceTab {
    workspacePath: string;
    availability?: WorkspaceAvailability;
    remoteSessionId?: string;
    remoteTarget?: RemoteTarget;
    workspaceIdentity?: string;
    localWorkspacePath?: string;
    workspacePurpose?: WorkspacePurpose;
}
export type WindowTabState = WorkspaceTabState | SettingsTabState;
export declare function isWorkspaceTab(tab: WindowTabState): tab is WorkspaceTabState;
export declare function isWorkspaceTabReadOnly(tab: WindowTabState): tab is WorkspaceTabState & {
    availability: "unavailable-local-directory";
};
export declare function isWorkspaceReadOnly(state: Pick<TabStoreState, "tabs">, workspacePath: string, workspaceIdentity?: string): boolean;
export declare function isSettingsTab(tab: WindowTabState): tab is SettingsTabState;
export interface TabStoreState {
    /** 当前窗口所有打开的标签页（有序） */
    tabs: WindowTabState[];
    /** 当前激活的标签页 ID，null 表示无激活标签 */
    activeTabId: TabId | null;
    /** 当前或最近一次激活的 workspace 路径 */
    activeWorkspacePath: string | null;
    /** 当前或最近一次激活的 workspace identity（远端同路径隔离） */
    activeWorkspaceIdentity: string | null;
    /** 左侧侧边栏中已展开的 workspace 路径集合 */
    expandedWorkspacePaths: Set<string>;
    /** 新增标签页，返回新 tab 的 ID */
    addTab: (workspacePath: string, options?: WorkspaceTabOptions) => TabId;
    /** 确保 workspace 出现在任务区数据源中，但不抢走当前焦点 */
    ensureWorkspaceTab: (workspacePath: string, options?: WorkspaceTabOptions) => TabId;
    /** 关闭标签页 */
    closeTab: (tabId: TabId) => void;
    /** 激活指定标签页 */
    activateTab: (tabId: TabId) => void;
    /** 拖拽排序：将 fromIndex 位置的 tab 移动到 toIndex */
    reorderTabs: (fromIndex: number, toIndex: number) => void;
    /** 仅按 workspace 子序列重排，保留设置页等非 workspace tab 的位置槽位 */
    reorderWorkspaceTabs: (fromIndex: number, toIndex: number) => void;
    /** 打开设置标签页（窗口内唯一） */
    openSettingsTab: () => void;
    /** 通过 workspace 路径激活 tab（跨窗口 focus 用），返回是否找到 */
    activateTabByPath: (path: string, options?: {
        workspaceIdentity?: string;
    }) => boolean;
    /** 切换 workspace 的展开/收起态 */
    toggleWorkspaceExpanded: (path: string) => void;
    /** 展开当前任务区里的全部 workspace */
    expandAllWorkspaceTabs: (paths: string[]) => void;
    /** 收起当前任务区里的全部 workspace */
    collapseAllWorkspaceTabs: (paths: string[]) => void;
    /** 批量恢复标签页（启动时从持久化数据恢复用） */
    restoreTabs: (tabs: Array<string | RestorableWorkspaceTab>, activeIndex: number) => void;
    /** 启动首帧后补齐持久化标签页；保留当前 active identity 和用户在此期间新增的标签页。 */
    completeTabRestore: (tabs: Array<string | RestorableWorkspaceTab>) => void;
}
interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export declare function createTabStore(storage?: StorageLike | null | undefined): import("zustand").UseBoundStore<import("zustand").StoreApi<TabStoreState>>;
export type TabStore = ReturnType<typeof createTabStore>;
export {};
//# sourceMappingURL=tabStore.d.ts.map