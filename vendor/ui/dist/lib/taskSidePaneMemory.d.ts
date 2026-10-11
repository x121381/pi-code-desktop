import type { GitChangeSourceId } from "@zcode/shared";
import { type WorkspaceSidePaneState } from "@/lib/workspaceSidePane.js";
export interface TaskSidePaneMemoryState {
    sidePaneState: WorkspaceSidePaneState | null;
    isSidePaneCollapsed: boolean;
    /** 对话级展开/收起偏好；tabs 本身仍按 workspace 复用。 */
    sidePaneCollapsedByOwner: Record<string, boolean>;
    /** 工具调用的自动打开已消费记录；不随消息行卸载清空。 */
    pluginUiAutoOpenKeys: ReadonlySet<string>;
    activeGitSourceId: GitChangeSourceId;
    browserUrls: Record<string, string>;
    /** @deprecated 旧版单浏览器 tab 的 URL，保留用于读取历史内存状态。 */
    browserUrl: string | null;
}
export declare const TASK_SIDE_PANE_MEMORY_MAX_ENTRIES = 50;
export declare function buildTaskSidePaneMemoryKey({ workspacePath, workspaceIdentity, taskId, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string | null;
}): string | null;
export declare function readTaskSidePaneMemoryState(key: string | null): TaskSidePaneMemoryState;
export declare function saveTaskSidePaneMemoryState(key: string | null, patch: Partial<TaskSidePaneMemoryState>): void;
export declare function getSidePaneCollapsedPreference(state: TaskSidePaneMemoryState, ownerTaskId: string | null | undefined): boolean | undefined;
export declare function saveTaskSidePaneCollapsedPreference(key: string | null, ownerTaskId: string | null | undefined, isSidePaneCollapsed: boolean): void;
export declare function clearTaskSidePaneMemoryStateForTest(): void;
export declare function claimPluginUiSidePaneAutoOpen(workspaceKey: string | null, requestKey: string): boolean;
//# sourceMappingURL=taskSidePaneMemory.d.ts.map