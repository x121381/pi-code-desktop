export function createShareImportIntent(shareCode, requestIdFactory = () => `share-import-request-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`, target) {
    return {
        shareCode,
        clientRequestId: requestIdFactory(),
        status: "received",
        ...(target?.targetWorkspacePath ? { targetWorkspacePath: target.targetWorkspacePath } : {}),
        ...(target?.targetWorkspaceIdentity
            ? { targetWorkspaceIdentity: target.targetWorkspaceIdentity }
            : {}),
        ...(target?.targetWorkspaceKind ? { targetWorkspaceKind: target.targetWorkspaceKind } : {}),
    };
}
export function isShareImportIntentSame(intent, payload) {
    return intent.shareCode === payload.shareCode;
}
export function resolveShareImportFailurePresentation(kind) {
    if (kind === "authentication_required") {
        return {
            messageId: "conversationShare.import.loginRequired",
            retryable: false,
        };
    }
    return {
        messageId: kind === "not_found"
            ? "conversationShare.import.notFound"
            : kind === "expired"
                ? "conversationShare.import.expired"
                : kind === "invalid_contract"
                    ? "conversationShare.import.integrityFailed"
                    : "conversationShare.import.failed",
        retryable: true,
    };
}
//# sourceMappingURL=shareImportIntent.js.map