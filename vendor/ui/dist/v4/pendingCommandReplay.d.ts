import type { CommandEnvelope } from "@zcode/shared/zcode-protocol-v4";
export type PendingCommandReplay = {
    kind: "input";
    type: "sendText" | "sendGoalCommand" | "compact" | "createSession";
    payload: Record<string, unknown>;
    baseRevision?: number;
} | {
    kind: "sensitiveDigest";
    type: "resolveInteraction" | "respondWorkspaceHookReview" | "toggleWorkspaceHookReviewItem" | "revokeWorkspaceHookTrust";
    digest: string;
};
export declare function pendingCommandReplayFor(envelope: CommandEnvelope): PendingCommandReplay | null;
//# sourceMappingURL=pendingCommandReplay.d.ts.map