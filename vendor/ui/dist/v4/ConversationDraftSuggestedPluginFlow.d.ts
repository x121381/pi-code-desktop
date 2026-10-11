import { type ZCodePluginsResolveSuggestedReferenceResult } from "@zcode/shared";
export interface DraftSuggestedPluginFlow {
    anchorItemId: string;
    operationId: string;
    plugin: {
        stableId: string;
        label: string;
    };
    result?: ZCodePluginsResolveSuggestedReferenceResult;
    stage: "checking" | "missing" | "disabled" | "unavailable";
}
export interface DraftSuggestedPluginOperation {
    operationId: string;
    abort: AbortController;
    pending?: Promise<unknown>;
    cancellation?: Promise<void>;
}
export interface ConversationDraftSuggestedPromptsContainerProps {
    className?: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    isDesktop?: boolean;
    isWebRemoteControl?: boolean;
}
export declare function trackDraftSuggestedPluginOperation<T>(operation: DraftSuggestedPluginOperation, pending: Promise<T>): Promise<T>;
export declare function resolveDraftSuggestedPluginFlowStage(result: ZCodePluginsResolveSuggestedReferenceResult): DraftSuggestedPluginFlow["stage"];
export declare function resolveSuggestedPluginClientBoundary(isWebRemoteControl: boolean): {
    clientMode: "desktop-continuous" | "web-remote-replayable";
    deliveryKind: "desktop-continuous" | "web-remote-replayable";
};
//# sourceMappingURL=ConversationDraftSuggestedPluginFlow.d.ts.map