import { type ZCodeBackgroundTaskControlItem, type ZCodeConfigOption, type ZCodeTaskMode, type ZCodeStreamEvent, type ZCodeTaskMeta, type ZCodeTaskSnapshot, type InputId, type ModelSelection, type ZCodePermissionRequestParams, type ZCodeSessionEvent, type ZCodeSessionMode, type ZCodeSessionSettingsState, type ZCodeSessionStateSnapshot, type ZCodeStateUpdatedNotification, type ZCodeToolProjectionMemory, type ZCodeUserInputRequestParams, type ZCodeUserInputResponse } from "@zcode/shared";
export interface ZCodeSessionEventProjectionState extends ZCodeToolProjectionMemory {
    activePromptInputIdBySession?: Map<string, InputId>;
    rewindControlTurnKeys?: Set<string>;
    activeApiRetrySessionIds?: Set<string>;
    backgroundTaskControlsBySession?: Map<string, ZCodeBackgroundTaskControlItem[]>;
    streamedTurnKeys?: Set<string>;
}
export declare function createZCodeSessionEventProjectionState(): ZCodeSessionEventProjectionState;
export type ZCodeSessionProjectionMode = "active-live" | "background-summary";
export declare function formatModelPickerValue(ref: ModelSelection | undefined): string;
export declare function parseModelPickerValue(value: string): ModelSelection;
export declare function toZCodeTaskMode(mode: ZCodeTaskMode | undefined): ZCodeSessionMode | undefined;
export declare function zcodeSessionSettingsToConfigOptions(settings: ZCodeSessionSettingsState): ZCodeConfigOption[];
export declare function zcodeWorkspacePresentationToConfigOptions(mode: ZCodeSessionMode): ZCodeConfigOption[];
export declare function zcodeSessionSnapshotToZCodeTaskSnapshot(snapshot: ZCodeSessionStateSnapshot): ZCodeTaskSnapshot;
export declare function zcodeSessionSnapshotToTaskMeta(snapshot: ZCodeSessionStateSnapshot): ZCodeTaskMeta;
export declare function zcodeSessionEventToZCodeStreamEvents(params: {
    event: ZCodeSessionEvent;
    projectionMode?: ZCodeSessionProjectionMode;
    state?: ZCodeSessionEventProjectionState;
    taskId: string;
}): ZCodeStreamEvent[];
export declare function zcodeStateUpdatedToZCodeStreamEvents(params: {
    notification: ZCodeStateUpdatedNotification;
    settings: ZCodeSessionSettingsState;
    taskId: string;
}): ZCodeStreamEvent[];
export declare function zcodePermissionRequestToZCodeStreamEvent(taskId: string, request: ZCodePermissionRequestParams): ZCodeStreamEvent;
export declare function zcodeUserInputRequestToZCodeStreamEvent(taskId: string, request: ZCodeUserInputRequestParams): Extract<ZCodeStreamEvent, {
    type: "elicitation_request";
}>;
export declare function zcodeUserInputResponseToZCodeStreamEvent(taskId: string, response: {
    requestId: string;
    action: ZCodeUserInputResponse["action"];
    content?: Record<string, unknown>;
}): Extract<ZCodeStreamEvent, {
    type: "elicitation_response";
}>;
export declare function syncZCodeSessionBackgroundTaskProjection(state: ZCodeSessionEventProjectionState | undefined, taskId: string, jobs: ZCodeBackgroundTaskControlItem[]): void;
export declare function syncZCodeSessionBackgroundTaskProjectionFromSnapshot(state: ZCodeSessionEventProjectionState | undefined, snapshot: ZCodeSessionStateSnapshot): void;
//# sourceMappingURL=zcodeSessionProjection.d.ts.map