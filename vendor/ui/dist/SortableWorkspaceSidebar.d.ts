import { type SortableBindings } from "./WorkspaceSidebarItem.js";
import type { WorkspaceTabState } from "@/store/tabStore.js";
import type { RemoteConnectionLogEntry } from "@/hooks/useRemoteConnectionLogs.js";
import type { ZCodeTaskMeta } from "@zcode/shared";
export type { SortableBindings };
export { restrictVerticalDragWithinContainer } from "@/lib/restrictVerticalDragWithinContainer.js";
export declare const SortableWorkspaceSidebarItem: import("react").MemoExoticComponent<({ tab, isActiveWorkspace, isExpanded, activateTab, closeTab, toggleWorkspaceExpanded, onSelectTask, onStartDraftInWorkspace, taskItems, taskListLoading, taskListHasMore, taskListHasUnread, taskListLiveWorkflowCount, mobileActiveTaskKey, isWebRemoteControl, workspaceKey, onShowMoreWorkspaceTasks, reconnectingRemoteWorkspaceKeys, remoteWorkspaceErrorByWorkspaceKey, reconnectingRemoteWorkspaceLogsByWorkspaceKey, onReconnectRemoteWorkspace, onOpenFileTree, }: {
    tab: WorkspaceTabState;
    isActiveWorkspace: boolean;
    isExpanded: boolean;
    activateTab: (tabId: string) => void;
    closeTab: (tabId: string) => void;
    toggleWorkspaceExpanded: (workspacePath: string) => void;
    onSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string) => void;
    onStartDraftInWorkspace: (targetWorkspacePath: string, targetWorkspaceIdentity?: string) => void;
    taskItems: ZCodeTaskMeta[];
    taskListLoading: boolean;
    taskListHasMore: boolean;
    taskListHasUnread?: boolean;
    taskListLiveWorkflowCount?: number;
    mobileActiveTaskKey?: string | null;
    isWebRemoteControl?: boolean;
    workspaceKey: string;
    onShowMoreWorkspaceTasks: (workspaceKey: string) => void;
    reconnectingRemoteWorkspaceKeys: string[];
    remoteWorkspaceErrorByWorkspaceKey: Record<string, string>;
    reconnectingRemoteWorkspaceLogsByWorkspaceKey: Record<string, RemoteConnectionLogEntry[]>;
    onReconnectRemoteWorkspace: (workspaceKey: string) => Promise<void>;
    onOpenFileTree: (target: {
        workspacePath: string;
        workspaceName: string;
        workspaceIdentity?: string;
        workspaceRemoteSessionId?: string;
    }) => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=SortableWorkspaceSidebar.d.ts.map