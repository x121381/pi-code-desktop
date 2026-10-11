import type { ZCodeTaskMeta, ZCodeTaskRuntimeStatus } from "@zcode/shared";
import type { IFileService } from "@zcode/services";
import type { WorkspaceZCodeUIState } from "@/store/zcodeSessionStoreTypes.js";
export declare const WINDOWS_RESERVED_NAME_SCAN_SKIPPED_DIRECTORIES: Set<string>;
export interface WorkspaceRemovalRiskScanOptions {
    maxEntries?: number;
    maxFindings?: number;
    skippedDirectories?: ReadonlySet<string>;
}
export interface WorkspaceRemovalRiskScanResult {
    findings: string[];
    scannedEntries: number;
    truncated: boolean;
}
export declare function hasRunningWorkspaceChat(params: {
    workspaceState: Pick<WorkspaceZCodeUIState, "draftRuntime" | "taskRuntimeByTaskId">;
    taskItems: Pick<ZCodeTaskMeta, "taskId">[];
}): boolean;
export declare function isWorkspaceRemovalBlockingRuntimeStatus(status: ZCodeTaskRuntimeStatus): boolean;
export declare function isWindowsReservedDevicePathSegment(segment: string): boolean;
export declare function scanWindowsReservedDeviceNameFiles(fileService: Pick<IFileService, "readdir">, rootPath: string, options?: WorkspaceRemovalRiskScanOptions): Promise<WorkspaceRemovalRiskScanResult>;
//# sourceMappingURL=workspaceRemovalSafety.d.ts.map