import type { ZCodeProvider, ZCodeError } from "@zcode/shared";
export declare const WORKSPACE_SESSION_RELOAD_DEBOUNCE_MS = 1200;
interface WorkspaceSessionReloadPlan {
    resumeTaskId: string | undefined;
    shouldPrepareWorkspace: boolean;
}
interface WorkspaceSessionReloadDraftErrorContext {
    workspacePath: string;
    provider: ZCodeProvider;
}
export declare function buildWorkspaceSessionReloadPlan(activeTaskId: string | null): WorkspaceSessionReloadPlan;
export declare function buildWorkspaceSessionReloadDraftError(err: unknown, context: WorkspaceSessionReloadDraftErrorContext): ZCodeError & {
    detail?: string;
};
export declare function shouldDebounceWorkspaceSessionReload(lastTriggeredAt: number | null, now: number, debounceWindowMs?: number): boolean;
export {};
//# sourceMappingURL=workspaceSessionReloadPlan.d.ts.map