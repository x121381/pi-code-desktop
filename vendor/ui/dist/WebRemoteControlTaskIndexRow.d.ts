import { type WebRemoteControlTaskTarget } from "@zcode/shared";
import { type MouseEvent as ReactMouseEvent } from "react";
import type { WebRemoteControlTaskIndexSortBy } from "@/lib/webRemoteControlTaskIndex.js";
interface WebRemoteControlTaskIndexRowIntl {
    formatMessage: (desc: {
        id: string;
    }, values?: Record<string, string>) => string;
}
export declare function WebRemoteControlTaskIndexRow({ activeTaskId, activeWorkspaceKey, canMutateTask, intl, mutatingTaskKey, onArchiveTask, onDeleteArchivedTask, onOpenTask, onToggleTaskPin, onUnarchiveTask, pendingArchiveTaskKey, showWorkspaceLabel, switchingTaskKey, task, taskSortBy, }: {
    activeTaskId: string | null;
    activeWorkspaceKey: string;
    canMutateTask: boolean;
    intl: WebRemoteControlTaskIndexRowIntl;
    mutatingTaskKey: string | null;
    onArchiveTask: (event: ReactMouseEvent, task: WebRemoteControlTaskTarget) => void;
    onDeleteArchivedTask: (event: ReactMouseEvent, task: WebRemoteControlTaskTarget) => void;
    onOpenTask: (task: WebRemoteControlTaskTarget) => void;
    onToggleTaskPin: (event: ReactMouseEvent, task: WebRemoteControlTaskTarget) => void;
    onUnarchiveTask: (event: ReactMouseEvent, task: WebRemoteControlTaskTarget) => void;
    pendingArchiveTaskKey: string | null;
    showWorkspaceLabel?: boolean;
    switchingTaskKey: string | null;
    task: WebRemoteControlTaskTarget;
    taskSortBy: WebRemoteControlTaskIndexSortBy;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WebRemoteControlTaskIndexRow.d.ts.map