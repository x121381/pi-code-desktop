/**
 * ZCode Session Store 导航切片 —— 任务前进/后退历史管理
 *
 * 从 zcodeSessionStore.ts 拆分出来，封装所有任务导航相关的初始状态和 action。
 * 通过 createNavigationSlice(set, get) 返回可直接展开到 store 的对象。
 */
import { createTaskNavigationHistory, goBack as navGoBack, goForward as navGoForward, pushAutomationsNavEntry, pushPluginStoreNavEntry, removeTaskFromHistory, } from "../lib/taskNavigationHistory.js";
/**
 * 创建导航切片，供 store creator 展开使用：
 * `...createNavigationSlice(set, get)`
 */
export function createNavigationSlice(set, get) {
    return {
        taskNavHistory: createTaskNavigationHistory(),
        taskNavPushAutomations: (workspacePath, workspaceIdentity, automationId, automationTab) => {
            set((state) => ({
                taskNavHistory: pushAutomationsNavEntry(state.taskNavHistory, workspacePath, workspaceIdentity, automationId, automationTab),
            }));
        },
        taskNavPushPluginStore: (workspacePath, workspaceIdentity) => {
            set((state) => ({
                taskNavHistory: pushPluginStoreNavEntry(state.taskNavHistory, workspacePath, workspaceIdentity),
            }));
        },
        taskNavGoBack: () => {
            const state = get();
            const result = navGoBack(state.taskNavHistory);
            if (!result) {
                return null;
            }
            set({ taskNavHistory: result.history });
            return result.entry;
        },
        taskNavGoForward: () => {
            const state = get();
            const result = navGoForward(state.taskNavHistory);
            if (!result) {
                return null;
            }
            set({ taskNavHistory: result.history });
            return result.entry;
        },
        removeTaskFromNavHistory: (taskId) => {
            set((state) => ({
                taskNavHistory: removeTaskFromHistory(state.taskNavHistory, taskId),
            }));
        },
    };
}
//# sourceMappingURL=zcodeSessionStoreNavigation.js.map