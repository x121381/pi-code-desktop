import type { ZCodeProvider } from "@zcode/shared";
type DraftWorkspacePrepareReason = "mount" | "select-provider";
type WorkspacePrepareReason = DraftWorkspacePrepareReason | "retry" | "first-send";
interface ResolveDraftWorkspacePrepareReasonOptions {
    previousDraftProvider: ZCodeProvider | null;
    previousTaskProvider: ZCodeProvider | null;
    selectedProvider: ZCodeProvider;
    returningFromTask: boolean;
}
export declare function resolveDraftWorkspacePrepareReason({ previousDraftProvider, previousTaskProvider, selectedProvider, returningFromTask, }: ResolveDraftWorkspacePrepareReasonOptions): DraftWorkspacePrepareReason;
interface ShouldShowDraftWorkspacePrepareLoadingOptions {
    taskId: string | null;
    reason: WorkspacePrepareReason;
    hasHydratedConfigOptions: boolean;
}
export declare function shouldShowDraftWorkspacePrepareLoading({ taskId, reason, hasHydratedConfigOptions, }: ShouldShowDraftWorkspacePrepareLoadingOptions): boolean;
export {};
//# sourceMappingURL=workspacePrepareReason.d.ts.map