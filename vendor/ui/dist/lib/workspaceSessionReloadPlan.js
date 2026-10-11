import { buildWorkspacePrepareUiError } from "../lib/chatPrepareError.js";
export const WORKSPACE_SESSION_RELOAD_DEBOUNCE_MS = 1200;
export function buildWorkspaceSessionReloadPlan(activeTaskId) {
    const resumeTaskId = activeTaskId?.trim();
    if (!resumeTaskId) {
        return {
            resumeTaskId: undefined,
            shouldPrepareWorkspace: true,
        };
    }
    return {
        resumeTaskId,
        shouldPrepareWorkspace: false,
    };
}
export function buildWorkspaceSessionReloadDraftError(err, context) {
    return buildWorkspacePrepareUiError(err, {
        workspacePath: context.workspacePath,
        provider: context.provider,
        reason: "reload-session",
        attempt: 1,
        maxAttempts: 1,
    });
}
export function shouldDebounceWorkspaceSessionReload(lastTriggeredAt, now, debounceWindowMs = WORKSPACE_SESSION_RELOAD_DEBOUNCE_MS) {
    if (lastTriggeredAt === null) {
        return false;
    }
    return now - lastTriggeredAt < debounceWindowMs;
}
//# sourceMappingURL=workspaceSessionReloadPlan.js.map