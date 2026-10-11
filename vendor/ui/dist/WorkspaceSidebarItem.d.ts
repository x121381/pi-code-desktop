import { type CSSProperties } from "react";
import type { useSortable } from "@dnd-kit/sortable";
import type { WorkspaceTabState } from "@/store/tabStore.js";
import type { RemoteConnectionLogEntry } from "@/hooks/useRemoteConnectionLogs.js";
import type { ZCodeTaskMeta } from "@zcode/shared";
export type SortableBindings = Pick<ReturnType<typeof useSortable>, "attributes" | "listeners">;
export declare const WorkspaceSidebarItem: import("react").MemoExoticComponent<({ tab, isActiveWorkspace, isExpanded, closeTab, toggleWorkspaceExpanded, onSelectTask, onStartDraftInWorkspace, taskItems, taskListLoading, taskListHasMore, taskListHasUnread, taskListLiveWorkflowCount, mobileActiveTaskKey, isWebRemoteControl, onShowMoreTasks, reconnectingRemoteWorkspaceKeys, remoteWorkspaceErrorByWorkspaceKey, reconnectingRemoteWorkspaceLogsByWorkspaceKey, onReconnectRemoteWorkspace, onOpenFileTree, itemRef, itemStyle, sortableBindings, isDragging, }: {
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
    /** 组内在跑的工作流 run 数；项目收起时在未读点旁画脉冲灯（>1 带数量）。 */
    taskListLiveWorkflowCount?: number;
    mobileActiveTaskKey?: string | null;
    isWebRemoteControl?: boolean;
    onShowMoreTasks: () => void;
    reconnectingRemoteWorkspaceKeys: string[];
    remoteWorkspaceErrorByWorkspaceKey: Record<string, string>;
    reconnectingRemoteWorkspaceLogsByWorkspaceKey: Record<string, RemoteConnectionLogEntry[]>;
    onReconnectRemoteWorkspace: (workspaceKey: string) => Promise<void>;
    onOpenFileTree?: (target: {
        workspacePath: string;
        workspaceName: string;
        workspaceIdentity?: string;
        workspaceRemoteSessionId?: string;
    }) => void;
    itemRef?: (node: HTMLLIElement | null) => void;
    itemStyle?: CSSProperties;
    sortableBindings?: SortableBindings;
    isDragging?: boolean;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WorkspaceSidebarItem.d.ts.map