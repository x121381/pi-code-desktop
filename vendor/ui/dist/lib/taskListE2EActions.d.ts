import { type TaskListMembershipRefreshHoldState } from "@/lib/taskListMembershipSets.js";
import { type TaskListQueryKind } from "@/lib/taskQueryCache.js";
export interface TaskListRefreshE2EProbe {
    matchingQueryCount: number;
    latestQueryStale: boolean | null;
    latestInvalidationVersion: number | null;
    taskPresent: boolean;
    taskStatus: string | null;
    activityPhase: string | null;
}
export interface TaskListMembershipE2EProbe {
    membershipKinds: TaskListQueryKind[];
    taskPresent: boolean;
}
export interface TaskListE2EActions {
    armTaskMembershipRefreshHold: () => void;
    releaseTaskMembershipRefreshHold: () => void;
    getTaskMembershipRefreshHoldState: () => TaskListMembershipRefreshHoldState;
    getTaskListRefreshProbe: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        taskId: string;
    }) => TaskListRefreshE2EProbe;
    getTaskListMembershipProbe: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        taskId: string;
    }) => TaskListMembershipE2EProbe;
}
export declare const taskListE2EActions: TaskListE2EActions;
//# sourceMappingURL=taskListE2EActions.d.ts.map