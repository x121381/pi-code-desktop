export const WEB_REMOTE_CONTROL_WORKSPACE_RECONNECT_TIMEOUT_MS = 120_000;
export const WEB_REMOTE_CONTROL_OUTBOUND_PAYLOAD_BUFFER_TIMEOUT_MS = 5_000;
export function createWebRemoteControlConnectionRecoveryTimeoutFailure(message) {
    return {
        // Bugfix: 手机端长时间后台后恢复超时，真实问题是手机连接未恢复，
        // 不能映射成 desktop-disconnected，否则错误页会误导用户以为电脑端离线。
        reason: "connection-recovery-timeout",
        message,
    };
}
export const WEB_REMOTE_CONTROL_RELAY_AUTH_PROOF_VECTORS = [
    {
        passHash: "dGVzdF9oYXNo",
        nonce: "nonce-1",
        role: "device",
        deviceSid: "device-1",
        proof: "XK0m7u-26VS88uk7ISAX5Z_9pjzq8jqyP77N-HkCsPE",
    },
    {
        passHash: "dGVzdF9oYXNo",
        nonce: "nonce-1",
        role: "terminal",
        deviceSid: "device-1",
        proof: "YkqkJy-p-iZK1g1AcoGd0Q83REOggX1EygWkcxW4oLU",
    },
];
function readNonEmptySearchParam(params, name) {
    const value = params.get(name)?.trim();
    return value ? value : undefined;
}
export function isWebRemoteControlThemeSeed(value) {
    return (value === "light" ||
        value === "dark" ||
        value === "zai-light" ||
        value === "zai-dark" ||
        value === "system");
}
export function resolveWebRemoteControlRoutePathFromBaseUrl(baseUrl) {
    const rawBaseUrl = baseUrl.trim() || "/";
    let pathname = "/";
    try {
        pathname = new URL(rawBaseUrl, "https://zcode.invalid").pathname;
    }
    catch {
        pathname = rawBaseUrl.startsWith("/") ? rawBaseUrl : `/${rawBaseUrl}`;
    }
    const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
    if (normalizedPathname === "/") {
        return "/remote";
    }
    return normalizedPathname;
}
export function matchesWebRemoteControlRoutePath(pathname, routePath) {
    // Bugfix: dev / production 入口可能带 /remote/ 尾斜杠；
    // 路由判断需要接受 /remote 与 /remote/，但不能把 /remote/favicon.ico 当成应用入口。
    const normalizeRoutePath = (value) => value.replace(/\/+$/, "") || "/";
    return normalizeRoutePath(pathname) === normalizeRoutePath(routePath);
}
export function buildWebRemoteControlExternalQrUrl({ baseUrl, deviceSid, passHash, timestamp, deviceMid, deviceName, appVersion, theme, }) {
    const url = new URL(baseUrl);
    url.searchParams.set("sid", deviceSid);
    url.searchParams.set("hash", passHash);
    url.searchParams.set("t", String(timestamp));
    if (deviceMid?.trim()) {
        url.searchParams.set("mid", deviceMid);
    }
    if (deviceName?.trim()) {
        url.searchParams.set("name", deviceName);
    }
    if (appVersion?.trim()) {
        url.searchParams.set("app_version", appVersion);
    }
    void theme;
    // Bugfix: 手机端主题现在固定走本地默认 dark，不再通过二维码 URL 透传 theme。
    // 之前 theme 参数会把桌面端主题耦合到手机首次进入行为，后续维护和排障都更复杂。
    // 这里保留入参仅做向后兼容，避免旧调用点一次性改动过大。
    return url.toString();
}
export function parseWebRemoteControlExternalQrParams(params) {
    const deviceSid = readNonEmptySearchParam(params, "sid");
    const passHash = readNonEmptySearchParam(params, "hash");
    const rawTimestamp = readNonEmptySearchParam(params, "t");
    const timestamp = rawTimestamp ? Number(rawTimestamp) : Number.NaN;
    const theme = readNonEmptySearchParam(params, "theme");
    if (!deviceSid || !passHash || !Number.isFinite(timestamp)) {
        return null;
    }
    return {
        deviceSid,
        passHash,
        timestamp,
        ...(readNonEmptySearchParam(params, "mid")
            ? { deviceMid: readNonEmptySearchParam(params, "mid") }
            : {}),
        ...(readNonEmptySearchParam(params, "name")
            ? { deviceName: readNonEmptySearchParam(params, "name") }
            : {}),
        ...(readNonEmptySearchParam(params, "app_version")
            ? { appVersion: readNonEmptySearchParam(params, "app_version") }
            : {}),
        ...(isWebRemoteControlThemeSeed(theme) ? { theme } : {}),
    };
}
export const WebRemoteControlCloseCodes = {
    SessionNotFound: 4004,
    SessionConflict: 4009,
    DesktopDisconnected: 4010,
    SessionExpired: 4011,
    WorkspaceClosed: 4012,
    InvalidMobileConnection: 4013,
};
export function resolveWebRemoteControlFailureReasonFromCloseCode(code) {
    switch (code) {
        case WebRemoteControlCloseCodes.SessionNotFound:
            return "session-not-found";
        case WebRemoteControlCloseCodes.SessionConflict:
            return "session-conflict";
        case WebRemoteControlCloseCodes.DesktopDisconnected:
            return "desktop-disconnected";
        case WebRemoteControlCloseCodes.SessionExpired:
            return "session-expired";
        case WebRemoteControlCloseCodes.WorkspaceClosed:
            return "workspace-closed";
        case WebRemoteControlCloseCodes.InvalidMobileConnection:
            return "invalid-mobile-connection";
        default:
            return null;
    }
}
export function resolveWebRemoteControlWorkspaceKey(target) {
    return target.workspaceIdentity?.trim() || target.workspacePath;
}
function isWebRemoteControlBridgeableWorkspaceTarget(workspace) {
    return (workspace.kind !== "remote" || Boolean(workspace.workspaceIdentity && workspace.remoteSessionId));
}
export function resolveWebRemoteControlInitialWorkspaceSelection({ workspaces, mobileViewState, initialViewState, }) {
    const bridgeableWorkspaces = workspaces.filter(isWebRemoteControlBridgeableWorkspaceTarget);
    const workspaceKeys = new Set(bridgeableWorkspaces.map((workspace) => resolveWebRemoteControlWorkspaceKey(workspace)));
    const allWorkspaceKeys = new Set(workspaces.map((workspace) => resolveWebRemoteControlWorkspaceKey(workspace)));
    const selectedViewState = mobileViewState ?? initialViewState;
    const selectedWorkspaceKey = selectedViewState?.activeWorkspaceKey;
    if (selectedWorkspaceKey && workspaceKeys.has(selectedWorkspaceKey)) {
        return {
            workspaceKey: selectedWorkspaceKey,
            ...(selectedViewState.activeTaskId ? { taskId: selectedViewState.activeTaskId } : {}),
            canBridge: true,
        };
    }
    // Bugfix: 手机端列表会展示已断开的 SSH workspace，但这类项没有 remoteSessionId，
    // 不能作为初始 bridge 目标。否则重连状态尚未同步时会反复进入“尚未连接”的错误页。
    const firstWorkspace = bridgeableWorkspaces[0];
    if (!firstWorkspace) {
        if (selectedWorkspaceKey && allWorkspaceKeys.has(selectedWorkspaceKey)) {
            return {
                workspaceKey: selectedWorkspaceKey,
                ...(selectedViewState?.activeTaskId ? { taskId: selectedViewState.activeTaskId } : {}),
                canBridge: false,
            };
        }
        const firstDisconnectedWorkspace = workspaces[0];
        if (!firstDisconnectedWorkspace) {
            return null;
        }
        return {
            workspaceKey: resolveWebRemoteControlWorkspaceKey(firstDisconnectedWorkspace),
            canBridge: false,
        };
    }
    return {
        workspaceKey: resolveWebRemoteControlWorkspaceKey(firstWorkspace),
        canBridge: true,
    };
}
//# sourceMappingURL=web-remote-control.js.map