import { type ArchivedTaskDeletionWorkspace, type ArchivedTaskDeletionTarget } from "@/lib/archivedTaskDeletion.js";
export declare function DeleteAllArchivedTasksButton({ workspaces, count, disabled, actionsContainer, onDeleted, onRefresh, }: {
    workspaces: ArchivedTaskDeletionWorkspace[];
    count: number;
    disabled: boolean;
    actionsContainer?: HTMLElement | null;
    onDeleted: (target: ArchivedTaskDeletionTarget) => void;
    onRefresh?: () => Promise<void>;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DeleteAllArchivedTasksButton.d.ts.map