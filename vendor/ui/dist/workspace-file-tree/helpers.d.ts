import { sortInstalledEditorsForOpenWith } from "@/lib/openWithEditors.js";
import type { WorkspaceFileTreeRow } from "@/workspace-file-tree/model.js";
export declare function toError(value: unknown): Error;
export declare function replaceSetValue(set: Set<string>, value: string, present: boolean): Set<string>;
export declare function getFileManagerLabel(intl: {
    formatMessage: (desc: {
        id: string;
    }) => string;
}): string;
export declare function isWorkspaceFileTreeHtmlFile(row: Pick<WorkspaceFileTreeRow, "path" | "type">): boolean;
export declare function createWorkspaceFileTreeHtmlBrowserUrl(row: Pick<WorkspaceFileTreeRow, "path" | "type">): string | null;
export declare const sortInstalledEditorsForFileTree: typeof sortInstalledEditorsForOpenWith;
//# sourceMappingURL=helpers.d.ts.map