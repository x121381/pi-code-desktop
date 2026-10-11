export function isRemoteConnectionFlowActive(snapshot) {
    return snapshot.loading || Boolean(snapshot.connectedSessionId);
}
export function shouldResetRemoteConnectionOnOpen(snapshot) {
    return !isRemoteConnectionFlowActive(snapshot);
}
export function getRemoteConnectionDialogResumeStep(snapshot) {
    if (isRemoteConnectionFlowActive(snapshot)) {
        return snapshot.currentStep;
    }
    if (snapshot.currentStep === "connecting") {
        return "connecting";
    }
    return "kind";
}
export function getRemoteConnectionCompletionDialogState(status) {
    return {
        // 远程连接弹窗收起后，连接完成只更新内部步骤但没有重新展示弹窗，
        // 用户会停留在其它页面且看不到选目录或失败原因。连接完成后统一拉起弹窗到结果步骤。
        open: true,
        step: status === "success" ? "directory" : "connecting",
    };
}
export function getRemoteConnectionDirectoryFailureState(params) {
    if (params.sessionStillRegistered) {
        return {
            connectedSessionId: params.connectedSessionId,
            step: "directory",
        };
    }
    // workspace 初始化失败会回收未确认 logical session。
    // 目录步骤继续持有旧 sessionId 时只能拿到空 services，并永久显示“加载中”。
    return {
        connectedSessionId: null,
        step: "settings",
    };
}
//# sourceMappingURL=remoteConnectionDialogState.js.map