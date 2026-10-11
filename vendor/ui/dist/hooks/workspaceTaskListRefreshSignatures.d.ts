import type { ZCodeTaskMeta } from "@zcode/shared";
export type WorkspaceTaskListVersionEntry = readonly [workspaceKey: string, version: number];
export interface WorkspaceRemoteSessionSignatureEntry {
    workspaceKey: string;
    remoteSessionId?: string;
    ready: boolean;
}
export declare function buildWorkspaceTaskListVersionSignature(entries: ReadonlyArray<WorkspaceTaskListVersionEntry>): string;
export declare function buildWorkspaceRemoteSessionSignature(entries: ReadonlyArray<WorkspaceRemoteSessionSignatureEntry>): string;
export declare function areTaskListItemsEquivalent(left: ZCodeTaskMeta[], right: ZCodeTaskMeta[]): boolean;
//# sourceMappingURL=workspaceTaskListRefreshSignatures.d.ts.map