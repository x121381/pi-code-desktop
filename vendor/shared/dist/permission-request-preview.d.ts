import type { ZCodePermissionRequest } from "./zcode-task-types-core.js";
export type PermissionRequestScope = "command" | "file" | "generic";
export interface PermissionRequestPreview {
    title: string;
    command: string | null;
    filePaths: string[];
    scope: PermissionRequestScope;
    fileChange: PermissionRequestFileChange | null;
    fileChanges: PermissionRequestFileChange[];
}
export interface PermissionRequestFileChange {
    path: string;
    type: "add" | "update";
}
export declare function getPermissionRequestPreview(request: Pick<ZCodePermissionRequest, "title" | "description" | "kind" | "raw">): PermissionRequestPreview;
//# sourceMappingURL=permission-request-preview.d.ts.map