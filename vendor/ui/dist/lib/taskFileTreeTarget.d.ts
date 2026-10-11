import type { ZCodeTaskMeta } from "@zcode/shared";
import type { WorkspaceTabState } from "@/store/tabStore.js";
export interface TaskFileTreeTarget {
    workspacePath: string;
    workspaceName: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
}
export declare function resolveTaskFileTreeTarget(task: ZCodeTaskMeta, tab: WorkspaceTabState | undefined): TaskFileTreeTarget | null;
export declare function resolveTaskFileTreeTargetFromTabs(task: ZCodeTaskMeta, tabs: readonly WorkspaceTabState[]): TaskFileTreeTarget | null;
//# sourceMappingURL=taskFileTreeTarget.d.ts.map