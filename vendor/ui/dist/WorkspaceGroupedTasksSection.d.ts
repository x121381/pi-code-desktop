import type { ReactNode } from "react";
import type { WorkspaceTabState } from "@/store/tabStore.js";
import type { CreateTaskRequest } from "@/app-shell/types.js";
export declare function WorkspaceGroupedTasksSection({ workspaceTabs, activeWorkspacePath, activeWorkspaceIdentity, activeTaskId, mobileActiveTaskKey, onSelectTask, onCreateTask, onOpenFileTree, onCreateGroupActionChange, onCreateDraftTaskActionChange, collapsedGroupIds, onGroupedTaskGroupIdsChange, onCollapsedGroupIdsChange, onStickyGroupHeaderChange, onOpenAutomations, }: {
    workspaceTabs: WorkspaceTabState[];
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    activeTaskId: string | null;
    mobileActiveTaskKey?: string | null;
    onSelectTask: (workspacePath: string, taskId: string, workspaceIdentity?: string) => void;
    onCreateTask: (request?: CreateTaskRequest) => void;
    onOpenFileTree?: (target: {
        workspacePath: string;
        workspaceName: string;
        workspaceIdentity?: string;
        workspaceRemoteSessionId?: string;
    }) => void;
    onCreateGroupActionChange?: (action: (() => void) | null) => void;
    onCreateDraftTaskActionChange?: (action: (() => void) | null) => void;
    collapsedGroupIds: ReadonlySet<string>;
    onGroupedTaskGroupIdsChange?: (groupIds: string[]) => void;
    onCollapsedGroupIdsChange: (updater: (currentGroupIds: Set<string>) => Set<string>) => void;
    onStickyGroupHeaderChange?: (node: ReactNode | null) => void;
    /** 闲时系统分组的「+」/右键新建路由到 Automations 主视图。 */
    onOpenAutomations?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkspaceGroupedTasksSection.d.ts.map