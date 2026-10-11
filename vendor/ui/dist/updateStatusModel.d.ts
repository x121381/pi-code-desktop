import type { ElectronReleaseChannel, PostUpdateReleaseNotesPayload, UpdateStatePayload } from "@zcode/shared";
export type UpdateStatusDialogPhase = "before-download" | "downloading" | "downloaded";
export type UpdateActionInFlight = "download" | "cancel" | "skip" | "restart" | null;
export type UpdateStatusViewModel = {
    dialogPhase: UpdateStatusDialogPhase;
    displayVersion: string | null;
    progressLabel: string | null;
    progressValue: number;
    releaseNotesPayload: PostUpdateReleaseNotesPayload | undefined;
    skippableVersion: string | null;
    updateChannel: ElectronReleaseChannel | undefined;
};
export declare function deriveUpdateStatusViewModel({ legacyReadyVersion, updateState, }: {
    legacyReadyVersion: string | null;
    updateState: UpdateStatePayload | null;
}): UpdateStatusViewModel;
export declare function isUpdateActionCompleted(action: UpdateActionInFlight, updateState: UpdateStatePayload | null): boolean;
export declare function getUpdateDownloadProgressLabel(updateState: UpdateStatePayload | null): string | null;
//# sourceMappingURL=updateStatusModel.d.ts.map