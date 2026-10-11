export type ShareImportIntentStatus = "received" | "waiting_for_auth" | "importing" | "complete" | "failed" | "cancelled";
export interface ShareImportIntent {
    shareCode: string;
    clientRequestId: string;
    status: ShareImportIntentStatus;
    targetWorkspacePath?: string;
    targetWorkspaceIdentity?: string;
    targetWorkspaceKind?: "local" | "remote";
}
export declare function createShareImportIntent(shareCode: string, requestIdFactory?: () => string, target?: Pick<ShareImportIntent, "targetWorkspacePath" | "targetWorkspaceIdentity" | "targetWorkspaceKind">): ShareImportIntent;
export declare function isShareImportIntentSame(intent: ShareImportIntent, payload: {
    shareCode: string;
}): boolean;
export declare function resolveShareImportFailurePresentation(kind: string): {
    messageId: "conversationShare.import.loginRequired" | "conversationShare.import.notFound" | "conversationShare.import.expired" | "conversationShare.import.integrityFailed" | "conversationShare.import.failed";
    retryable: boolean;
};
//# sourceMappingURL=shareImportIntent.d.ts.map