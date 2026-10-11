import type { SessionCreateSource } from "@zcode/shared";
import { type ZCodeConfigOption, type ModelSelectionResolution, type ZCodeProvider, type ZCodeSlashCommand, type ZCodeTaskMeta, type ZCodeTaskRuntimeStatus, type ZCodeWorkspaceInitStatus } from "@zcode/shared";
import type { ZCodeUiError } from "@/lib/zcodeUiError.js";
import type { ZCodeSessionStoreState, ComposerMentionPrefill, GroupedDraftTaskState, GroupedDraftTaskPlacement, ModelSwitchStage } from "@/store/zcodeSessionStoreTypes.js";
type SetFn = (partial: ZCodeSessionStoreState | Partial<ZCodeSessionStoreState> | ((state: ZCodeSessionStoreState) => ZCodeSessionStoreState | Partial<ZCodeSessionStoreState>)) => void;
export declare function createWorkspaceSlice(set: SetFn): {
    setActiveTaskId: (workspacePath: string, id: string | null, workspaceIdentity?: string) => void;
    promoteGroupedDraftTask: (workspacePath: string, taskId: string, draft: GroupedDraftTaskState, workspaceIdentity?: string) => void;
    clearPromotedGroupedDraftTask: (workspacePath: string, taskId: string, workspaceIdentity?: string) => void;
    setDraftSessionId: (workspacePath: string, sessionId: string | null, workspaceIdentity?: string) => void;
    invalidateDraftRuntime: (workspacePath: string, workspaceIdentity?: string) => void;
    requestComposerTextInsert: (workspacePath: string, text: string, workspaceIdentity?: string, mention?: ComposerMentionPrefill, mode?: "replace" | "prepend-if-missing") => number;
    clearComposerTextInsertRequest: (workspacePath: string, requestId: number, workspaceIdentity?: string) => void;
    requestTimelineBottom: (workspacePath: string, taskId: string, workspaceIdentity?: string) => number;
    clearTimelineBottomRequest: (workspacePath: string, requestId: number, workspaceIdentity?: string) => void;
    startDraft: (workspacePath: string, provider?: ZCodeProvider, workspaceIdentity?: string, options?: {
        groupedDraftPlacement?: GroupedDraftTaskPlacement;
        createSource?: SessionCreateSource;
    }) => void;
    clearGroupedDraftTask: (workspacePath: string, workspaceIdentity?: string) => void;
    bindRuntimeProvider: (workspacePath: string, provider: ZCodeProvider, workspaceIdentity?: string) => void;
    setModelSelectionResolution: (workspacePath: string, resolution: Pick<ModelSelectionResolution, "selectedSupplierKey" | "isGhostSupplier" | "supplierMismatchReason">, workspaceIdentity?: string) => void;
    setWorkspaceInitState: (workspacePath: string, status: ZCodeWorkspaceInitStatus, error?: string | null, workspaceIdentity?: string) => void;
    setWorkspaceInitAttempts: (workspacePath: string, attempts: number, workspaceIdentity?: string) => void;
    setTaskState: (workspacePath: string, status: ZCodeTaskRuntimeStatus, error?: string | null, workspaceIdentity?: string) => void;
    setDraftError: (workspacePath: string, error: ZCodeUiError | null, workspaceIdentity?: string) => void;
    startModelSwitch: (workspacePath: string, requestId: string, stage?: ModelSwitchStage, workspaceIdentity?: string, options?: {
        pending?: boolean;
    }) => void;
    updateModelSwitchStage: (workspacePath: string, requestId: string, stage: ModelSwitchStage, workspaceIdentity?: string) => void;
    finishModelSwitch: (workspacePath: string, requestId: string, workspaceIdentity?: string) => void;
    setConfigOptions: (workspacePath: string, options: ZCodeConfigOption[], workspaceIdentity?: string) => void;
    setConfigOptionsStatus: (workspacePath: string, status: "idle" | "loading" | "ready" | "error", workspaceIdentity?: string) => void;
    setSlashCommands: (workspacePath: string, commands: ZCodeSlashCommand[], workspaceIdentity?: string) => void;
    setCurrentModeId: (workspacePath: string, modeId: string | null, workspaceIdentity?: string) => void;
    bumpTaskListVersion: (workspacePath: string, workspaceIdentity?: string) => void;
    setTaskListCache: (workspacePath: string, tasks: ZCodeTaskMeta[], workspaceIdentity?: string) => void;
    setTaskUnreadIndicator: (workspacePath: string, taskId: string, hasUnread: boolean, workspaceIdentity?: string) => void;
};
export {};
//# sourceMappingURL=zcodeSessionStoreWorkspaceSlice.d.ts.map