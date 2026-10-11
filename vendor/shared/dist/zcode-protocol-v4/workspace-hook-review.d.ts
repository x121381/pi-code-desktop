import { z } from "zod";
export declare const workspaceHookReviewTrustStateSchema: z.ZodEnum<{
    not_applicable: "not_applicable";
    pending_trust: "pending_trust";
    trusted_persistent: "trusted_persistent";
    blocked_untrusted: "blocked_untrusted";
    blocked_policy: "blocked_policy";
    revoked: "revoked";
    stale_digest: "stale_digest";
}>;
export type WorkspaceHookReviewTrustState = z.infer<typeof workspaceHookReviewTrustStateSchema>;
export declare const workspaceHookReviewDecisionSchema: z.ZodObject<{
    action: z.ZodLiteral<"trust_selected">;
    reviewItemIds: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export type WorkspaceHookReviewDecision = z.infer<typeof workspaceHookReviewDecisionSchema>;
export declare const workspaceHookReviewCommandTargetSchema: z.ZodObject<{
    sessionId: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodString;
    bundleDigest: z.ZodString;
    reviewFlowId: z.ZodString;
    generation: z.ZodNumber;
    interactionId: z.ZodString;
}, z.core.$strict>;
export type WorkspaceHookReviewCommandTarget = z.infer<typeof workspaceHookReviewCommandTargetSchema>;
export declare const workspaceHookTrustRevokeTargetSchema: z.ZodObject<{
    sessionId: z.ZodString;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodString;
    bundleDigest: z.ZodString;
    hookDeclarationDigests: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export type WorkspaceHookTrustRevokeTarget = z.infer<typeof workspaceHookTrustRevokeTargetSchema>;
export declare const requestWorkspaceHookReviewTargetSchema: z.ZodObject<{
    sessionId: z.ZodString;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodString;
    bundleDigest: z.ZodString;
}, z.core.$strict>;
export type RequestWorkspaceHookReviewTarget = z.infer<typeof requestWorkspaceHookReviewTargetSchema>;
export declare const workspaceHookReviewRequestPayloadSchema: z.ZodObject<{
    kind: z.ZodLiteral<"workspaceHookReview">;
    reviewFlowId: z.ZodString;
    generation: z.ZodNumber;
    interactionId: z.ZodString;
    sessionId: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    workspaceIdentity: z.ZodString;
    workspaceLabel: z.ZodString;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    bundleDigest: z.ZodString;
    createdAt: z.ZodNumber;
    deadlineAt: z.ZodNumber;
    sourceFiles: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        displayPath: z.ZodString;
        editable: z.ZodBoolean;
    }, z.core.$strict>>;
    summary: z.ZodObject<{
        eventCount: z.ZodNumber;
        hookCount: z.ZodNumber;
        pendingCount: z.ZodNumber;
    }, z.core.$strict>;
    items: z.ZodArray<z.ZodObject<{
        reviewItemId: z.ZodString;
        event: z.ZodEnum<{
            SessionStart: "SessionStart";
            UserPromptSubmit: "UserPromptSubmit";
            PreToolUse: "PreToolUse";
            PermissionRequest: "PermissionRequest";
            PostToolUse: "PostToolUse";
            PostToolUseFailure: "PostToolUseFailure";
            Stop: "Stop";
        }>;
        matcher: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<{
            command: "command";
            process: "process";
        }>;
        displayName: z.ZodString;
        displayCommand: z.ZodString;
        sourcePath: z.ZodString;
        resolvedTimeoutMs: z.ZodNumber;
        resolvedMaxOutputBytes: z.ZodNumber;
        executionMode: z.ZodEnum<{
            background: "background";
            foreground: "foreground";
        }>;
        configuredEnabled: z.ZodBoolean;
        editable: z.ZodBoolean;
        trustState: z.ZodEnum<{
            not_applicable: "not_applicable";
            pending_trust: "pending_trust";
            trusted_persistent: "trusted_persistent";
            blocked_untrusted: "blocked_untrusted";
            blocked_policy: "blocked_policy";
            revoked: "revoked";
            stale_digest: "stale_digest";
        }>;
    }, z.core.$strict>>;
    warningCode: z.ZodLiteral<"workspace_hooks_execute_code">;
}, z.core.$strict>;
export type WorkspaceHookReviewRequestPayload = z.infer<typeof workspaceHookReviewRequestPayloadSchema>;
export declare const presentWorkspaceHookReviewRequestSchema: z.ZodObject<{
    reviewFlowId: z.ZodString;
    generation: z.ZodNumber;
    interactionId: z.ZodString;
    sessionId: z.ZodString;
    workspaceIdentity: z.ZodString;
    bundleDigest: z.ZodString;
    settingsSection: z.ZodLiteral<"hooks">;
    settingsScope: z.ZodLiteral<"workspace">;
}, z.core.$strict>;
export type PresentWorkspaceHookReviewRequest = z.infer<typeof presentWorkspaceHookReviewRequestSchema>;
//# sourceMappingURL=workspace-hook-review.d.ts.map