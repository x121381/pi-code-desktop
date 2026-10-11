export function beginCodingPlanUpgradeLogin(params) {
    const loginAttemptId = params.requestLoginEntry(params.oauthProviderId);
    const pending = {
        loginAttemptId,
        target: {
            ...params.target,
            initialAudience: params.audience,
        },
    };
    params.onClose();
    return pending;
}
export function resolvePendingCodingPlanUpgradeAfterLogin(params) {
    if (!params.pending || !params.loginAttempt) {
        return { action: "wait" };
    }
    if (params.loginAttempt.id !== params.pending.loginAttemptId) {
        return { action: "discard" };
    }
    if (params.loginAttempt.status === "requested" ||
        params.loginAttempt.status === "waiting") {
        return { action: "wait" };
    }
    if (params.loginAttempt.status === "succeeded") {
        return { action: "reopen", target: params.pending.target };
    }
    return { action: "discard" };
}
//# sourceMappingURL=codingPlanUpgradeLoginRecovery.js.map