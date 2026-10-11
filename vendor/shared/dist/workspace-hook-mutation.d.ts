import type { WorkspaceHookBundleSnapshotData } from "./workspace-hook-digest.js";
export interface AtomicWorkspaceHookConfigWriteOptions {
    beforeRename?: () => void | Promise<void>;
}
export declare class WorkspaceHookMutationError extends Error {
    readonly code: "workspace_hooks_snapshot_mismatch" | "workspace_hooks_bundle_changed" | "workspace_hooks_config_unreadable" | "workspace_hooks_config_write_failed";
    constructor(code: "workspace_hooks_snapshot_mismatch" | "workspace_hooks_bundle_changed" | "workspace_hooks_config_unreadable" | "workspace_hooks_config_write_failed", message: string, options?: ErrorOptions);
}
/**
 * Workspace Hook settings writes must never expose a partially-written config to Runtime watchers.
 * The temp file is written in the destination directory, flushed, closed, then atomically renamed.
 */
export declare function atomicWriteWorkspaceHookConfig(filePath: string, value: Record<string, unknown>, options?: AtomicWorkspaceHookConfigWriteOptions): Promise<void>;
export declare function writeWorkspaceHookConfiguredToggle(input: {
    configPath: string;
    snapshot: WorkspaceHookBundleSnapshotData;
    reviewItemId: string;
    enabled: boolean;
    writeOptions?: AtomicWorkspaceHookConfigWriteOptions;
}): Promise<void>;
//# sourceMappingURL=workspace-hook-mutation.d.ts.map