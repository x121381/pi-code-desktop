import { type ReactNode } from "react";
import { type WebRemoteControlWorkspaceListResult } from "@zcode/shared";
import { type WebRemoteControlTaskIndexSortBy, type WebRemoteControlTaskIndexViewMode } from "@/lib/webRemoteControlTaskIndex.js";
import type { WebRemoteControlWorkspaceSwitcherApi } from "@/root/types.js";
export declare function WebRemoteControlTaskIndex({ switcher, activeWorkspacePath, activeWorkspaceIdentity, activeTaskId, taskSortBy, taskViewMode, searchQuery, collapsedWorkspaceKeys, initialResult, onToggleWorkspaceCollapsed, onWorkspaceGroupKeysChange, renderBeforePinnedTasks, archivedActionsContainer, onSelectTask, onTaskOpen, onCrossWorkspaceSwitchingChange, }: {
    switcher: WebRemoteControlWorkspaceSwitcherApi;
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    activeTaskId: string | null;
    taskSortBy?: WebRemoteControlTaskIndexSortBy;
    taskViewMode?: WebRemoteControlTaskIndexViewMode;
    searchQuery?: string;
    collapsedWorkspaceKeys?: ReadonlySet<string>;
    initialResult?: WebRemoteControlWorkspaceListResult;
    onToggleWorkspaceCollapsed?: (workspaceKey: string) => void;
    onWorkspaceGroupKeysChange?: (workspaceKeys: string[]) => void;
    renderBeforePinnedTasks?: () => ReactNode;
    archivedActionsContainer?: HTMLElement | null;
    onSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string) => void;
    onTaskOpen?: (options: {
        crossWorkspace: boolean;
    }) => void;
    onCrossWorkspaceSwitchingChange?: (switching: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WebRemoteControlTaskIndex.d.ts.map