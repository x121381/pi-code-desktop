/**
 * Workspace 导航历史 —— 浏览器式前进/后退栈
 *
 * 纯数据结构 + 不可变更新函数，不含 React 依赖。
 * 由 zcodeSessionStore 持有实例并驱动 UI 状态。
 */
interface WorkspaceNavEntryBase {
    workspacePath: string;
    workspaceIdentity?: string;
}
export interface TaskNavEntry extends WorkspaceNavEntryBase {
    kind: "task";
    taskId: string;
}
export type AutomationsNavigationTab = "scheduled" | "idle" | "workflow";
export type OpenAutomationsMain = (automationId?: string, automationTab?: AutomationsNavigationTab) => void;
export interface AutomationsNavEntry extends WorkspaceNavEntryBase {
    kind: "automations";
    automationId?: string;
    automationTab?: AutomationsNavigationTab;
}
export interface PluginStoreNavEntry extends WorkspaceNavEntryBase {
    kind: "plugin-store";
}
export type WorkspaceNavEntry = TaskNavEntry | AutomationsNavEntry | PluginStoreNavEntry;
export interface TaskNavigationHistory {
    entries: WorkspaceNavEntry[];
    /** 当前指针，指向 entries 中的索引；-1 表示空 */
    cursor: number;
}
export declare function createTaskNavigationHistory(): TaskNavigationHistory;
export declare function isTaskNavEntry(entry: WorkspaceNavEntry): entry is TaskNavEntry;
export declare function isAutomationsNavEntry(entry: WorkspaceNavEntry): entry is AutomationsNavEntry;
export declare function isPluginStoreNavEntry(entry: WorkspaceNavEntry): entry is PluginStoreNavEntry;
/** 用户主动选择/创建 task 时调用。 */
export declare function pushNavEntry(history: TaskNavigationHistory, workspacePath: string, taskId: string, workspaceIdentity?: string): TaskNavigationHistory;
/** 用户主动打开 Automations 主视图或指定详情时调用。 */
export declare function pushAutomationsNavEntry(history: TaskNavigationHistory, workspacePath: string, workspaceIdentity?: string, automationId?: string, automationTab?: AutomationsNavigationTab): TaskNavigationHistory;
export declare function pushPluginStoreNavEntry(history: TaskNavigationHistory, workspacePath: string, workspaceIdentity?: string): TaskNavigationHistory;
export declare function canGoBack(history: TaskNavigationHistory): boolean;
export declare function canGoForward(history: TaskNavigationHistory): boolean;
/** 后退一步，返回新的 history 和目标 entry。 */
export declare function goBack(history: TaskNavigationHistory): {
    history: TaskNavigationHistory;
    entry: WorkspaceNavEntry;
} | null;
/** 前进一步，返回新的 history 和目标 entry。 */
export declare function goForward(history: TaskNavigationHistory): {
    history: TaskNavigationHistory;
    entry: WorkspaceNavEntry;
} | null;
/**
 * 从历史中移除指定 taskId 的所有 task 条目（task 被删除时调用）。
 * Automations 条目不属于 task 生命周期，必须原样保留。
 */
export declare function removeTaskFromHistory(history: TaskNavigationHistory, taskId: string): TaskNavigationHistory;
export {};
//# sourceMappingURL=taskNavigationHistory.d.ts.map