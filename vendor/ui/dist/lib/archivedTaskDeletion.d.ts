import type { IZCodeTaskService } from "@zcode/services";
export interface ArchivedTaskDeletionTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string;
}
export interface ArchivedTaskDeletionWorkspace {
    workspacePath: string;
    workspaceIdentity?: string;
    label: string;
    service?: Pick<IZCodeTaskService, "listArchivedTasks" | "deleteArchivedTasks">;
}
export declare function collectArchivedTaskDeletion(workspaces: ArchivedTaskDeletionWorkspace[]): Promise<{
    groups: {
        workspace: ArchivedTaskDeletionWorkspace;
        targets: {
            taskId: string;
            workspacePath: string;
            workspaceIdentity: string | undefined;
        }[];
    }[];
    count: number;
    unavailableWorkspaces: string[];
}>;
export declare function deleteArchivedTaskSelection(selection: Awaited<ReturnType<typeof collectArchivedTaskDeletion>>, onDeleted: (target: ArchivedTaskDeletionTarget) => void): Promise<{
    deleted: number;
    skipped: number;
    failed: number;
    unavailableWorkspaces: string[];
}>;
//# sourceMappingURL=archivedTaskDeletion.d.ts.map