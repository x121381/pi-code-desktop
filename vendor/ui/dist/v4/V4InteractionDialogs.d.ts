import type { ZCodeElicitationRequest, ZCodeProvider } from "@zcode/shared";
import type { ConversationSnapshot } from "@zcode/shared/zcode-protocol-v4";
export interface V4InteractionDialogsProps {
    sessionId: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    isWebRemoteControl?: boolean;
    provider?: ZCodeProvider;
    snapshot: ConversationSnapshot | null;
    onCommandSettled?: (commandId: string) => void;
    onPlanInteractionAccepted?: (interactionId: string) => void;
}
export declare function getCurrentSessionInteractionSnapshot(sessionId: string, snapshot: ConversationSnapshot | null): ConversationSnapshot | null;
export declare function resolveV4ElicitationRequest(projected: ZCodeElicitationRequest | null, botProgress: ZCodeElicitationRequest | null): ZCodeElicitationRequest | null;
export declare function buildV4ElicitationProgressKey(request: ZCodeElicitationRequest): string;
export interface InteractionAutoResolutionIntentTracker {
    markInteracted(interactionId: string): void;
    consumeSnooze(interactionId: string, autoResolutionReady: boolean): boolean;
    releaseSnooze(interactionId: string): void;
}
export declare function createInteractionAutoResolutionIntentTracker(): InteractionAutoResolutionIntentTracker;
/**
 * 竖切：把 projection.pendingInteractions 接到 PermissionDialog / userInput 弹窗。
 * ChatView 删除后若无此组件，带 tool 权限的会话会永久阻塞。
 */
export declare function V4InteractionDialogs({ sessionId, workspacePath, workspaceIdentity, remoteSessionId, isWebRemoteControl, provider, snapshot, onCommandSettled, onPlanInteractionAccepted, }: V4InteractionDialogsProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=V4InteractionDialogs.d.ts.map