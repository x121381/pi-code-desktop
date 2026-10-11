import { type PaneLayoutSnapshot } from "@/v4/paneLayoutStore.js";
import { type WorkbenchGroup } from "@/v4/workbenchGroupStore.js";
export interface WorkbenchNewTaskTarget {
    workspacePath: string;
    workspaceIdentity?: string;
}
export declare function resolveWorkbenchNewTaskTarget({ activeWorkspacePath, activeWorkspaceIdentity, activeGroup, paneLayout, }: {
    activeWorkspacePath: string | null;
    activeWorkspaceIdentity?: string | null;
    activeGroup: WorkbenchGroup | null;
    paneLayout: PaneLayoutSnapshot;
}): WorkbenchNewTaskTarget | null;
//# sourceMappingURL=workbenchNewTaskTarget.d.ts.map