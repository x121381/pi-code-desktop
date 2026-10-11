/**
 * ZCode Session Store 导航切片 —— 任务前进/后退历史管理
 *
 * 从 zcodeSessionStore.ts 拆分出来，封装所有任务导航相关的初始状态和 action。
 * 通过 createNavigationSlice(set, get) 返回可直接展开到 store 的对象。
 */
import { type AutomationsNavigationTab, type WorkspaceNavEntry } from "@/lib/taskNavigationHistory.js";
import type { ZCodeSessionStoreState } from "./zcodeSessionStoreTypes.js";
type SetFn = (partial: ZCodeSessionStoreState | Partial<ZCodeSessionStoreState> | ((state: ZCodeSessionStoreState) => ZCodeSessionStoreState | Partial<ZCodeSessionStoreState>)) => void;
type GetFn = () => ZCodeSessionStoreState;
/**
 * 创建导航切片，供 store creator 展开使用：
 * `...createNavigationSlice(set, get)`
 */
export declare function createNavigationSlice(set: SetFn, get: GetFn): {
    taskNavHistory: import("@/lib/taskNavigationHistory.js").TaskNavigationHistory;
    taskNavPushAutomations: (workspacePath: string, workspaceIdentity?: string, automationId?: string, automationTab?: AutomationsNavigationTab) => void;
    taskNavPushPluginStore: (workspacePath: string, workspaceIdentity?: string) => void;
    taskNavGoBack: () => WorkspaceNavEntry | null;
    taskNavGoForward: () => WorkspaceNavEntry | null;
    removeTaskFromNavHistory: (taskId: string) => void;
};
export {};
//# sourceMappingURL=zcodeSessionStoreNavigation.d.ts.map