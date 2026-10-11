import { useCallback } from "react";
import { useZCodeSessionStore } from "../store/zcodeSessionStore.js";
export function useComposerTextInsertApplied(workspacePath, workspaceIdentity) {
    return useCallback((requestId, signal) => new Promise((resolve) => {
        let unsubscribe = () => undefined;
        let settled = false;
        const finish = (applied) => {
            if (settled)
                return;
            settled = true;
            unsubscribe();
            signal.removeEventListener("abort", handleAbort);
            resolve(applied);
        };
        const handleAbort = () => {
            const request = useZCodeSessionStore
                .getState()
                .getWorkspaceState(workspacePath, workspaceIdentity).composerTextInsertRequest;
            finish(false);
            if (request?.requestId === requestId) {
                useZCodeSessionStore
                    .getState()
                    .clearComposerTextInsertRequest(workspacePath, requestId, workspaceIdentity);
            }
        };
        const inspect = () => {
            const state = useZCodeSessionStore
                .getState()
                .getWorkspaceState(workspacePath, workspaceIdentity);
            if (state.composerTextInsertVersion > requestId) {
                finish(false);
            }
            else if (state.composerTextInsertVersion === requestId &&
                state.composerTextInsertRequest === null) {
                finish(true);
            }
        };
        if (signal.aborted) {
            resolve(false);
            return;
        }
        unsubscribe = useZCodeSessionStore.subscribe(inspect);
        signal.addEventListener("abort", handleAbort, { once: true });
        inspect();
    }), [workspaceIdentity, workspacePath]);
}
//# sourceMappingURL=useComposerTextInsertApplied.js.map