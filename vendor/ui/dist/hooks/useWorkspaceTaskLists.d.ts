import type { WorkspaceTabState } from "@/store/tabStore.js";
import { type WorkspaceTaskListGroup } from "@/hooks/workspaceTaskListDisplayGroups.js";
export declare function useWorkspaceTaskLists(params: {
    workspaceTabs: WorkspaceTabState[];
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    sortBy: "created" | "updated";
    visibleLimitByWorkspaceKey: Readonly<Record<string, number>>;
    defaultVisibleLimit: number;
}): {
    groups: WorkspaceTaskListGroup[];
    loadingByWorkspaceKey: Record<string, boolean>;
    refresh: () => Promise<void>;
};
//# sourceMappingURL=useWorkspaceTaskLists.d.ts.map