import type { RemoteWizardStep } from "@/RemoteConnectionWizardChrome.js";
export interface RemoteConnectionDialogSnapshot {
    currentStep: RemoteWizardStep;
    loading: boolean;
    connectedSessionId: string | null;
}
type RemoteConnectionCompletionStatus = "success" | "error";
interface RemoteConnectionCompletionDialogState {
    open: boolean;
    step: RemoteWizardStep;
}
interface RemoteConnectionDirectoryFailureState {
    connectedSessionId: string | null;
    step: RemoteWizardStep;
}
export declare function isRemoteConnectionFlowActive(snapshot: RemoteConnectionDialogSnapshot): boolean;
export declare function shouldResetRemoteConnectionOnOpen(snapshot: RemoteConnectionDialogSnapshot): boolean;
export declare function getRemoteConnectionDialogResumeStep(snapshot: RemoteConnectionDialogSnapshot): RemoteWizardStep;
export declare function getRemoteConnectionCompletionDialogState(status: RemoteConnectionCompletionStatus): RemoteConnectionCompletionDialogState;
export declare function getRemoteConnectionDirectoryFailureState(params: {
    connectedSessionId: string;
    sessionStillRegistered: boolean;
}): RemoteConnectionDirectoryFailureState;
export {};
//# sourceMappingURL=remoteConnectionDialogState.d.ts.map