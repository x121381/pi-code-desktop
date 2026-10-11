import type { WorkspaceFileEntry } from "@zcode/shared";
import { type WorkspaceFileTreeRow } from "@/workspace-file-tree/model.js";
export declare function createWorkspaceFileTreeRowsFromSearchEntries(entries: WorkspaceFileEntry[]): WorkspaceFileTreeRow[];
export declare function getWorkspaceFileSearchDirectoryRevealPaths({ workspacePath, directoryPath, }: {
    workspacePath: string;
    directoryPath: string;
}): string[];
//# sourceMappingURL=searchRows.d.ts.map