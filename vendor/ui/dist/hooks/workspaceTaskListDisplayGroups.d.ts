import type { ZCodeTaskMeta } from "@zcode/shared";
import type { CachedTaskListResult } from "@/lib/taskQueryCache.js";
import { type WorkspaceOptimisticTaskOverlay } from "@/hooks/workspaceTaskListOptimisticOverlay.js";
interface WorkspaceTaskListDisplayConfig {
    scope: {
        workspacePath: string;
        workspaceIdentity?: string;
    };
    workspaceKey: string;
    visibleLimit: number;
    queryKey: string;
}
export interface WorkspaceTaskListGroup {
    workspacePath: string;
    workspaceIdentity?: string;
    items: ZCodeTaskMeta[];
    total: number;
    hasMore: boolean;
    hasUnread: boolean;
    /** 组内在跑的工作流 run 数：项目收起时组头旁的脉冲灯。 */
    liveWorkflowCount: number;
}
export declare function buildWorkspaceTaskListDisplayGroups(params: {
    queryConfigs: WorkspaceTaskListDisplayConfig[];
    resultsByQueryKey: Record<string, CachedTaskListResult>;
    taskMetaByEntityKey: Record<string, ZCodeTaskMeta>;
    taskUnreadOverlayByEntityKey: Record<string, number | null>;
    optimisticTaskOverlayByWorkspaceKey: Map<string, WorkspaceOptimisticTaskOverlay>;
    previousGroupsByWorkspaceKey: Map<string, WorkspaceTaskListGroup>;
    sortBy: "created" | "updated";
}): {
    groups: WorkspaceTaskListGroup[];
    cache: Map<string, WorkspaceTaskListGroup>;
};
export {};
//# sourceMappingURL=workspaceTaskListDisplayGroups.d.ts.map