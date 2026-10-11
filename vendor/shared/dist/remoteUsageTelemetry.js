import { parseRemoteWorkspaceIdentity, } from "./remote-workspace-identity.js";
/** 只提取场景枚举；未知远端身份仍为 remote，禁止向业务埋点暴露地址或路径。 */
export function resolveWorkspaceTelemetryDetail(scope) {
    const identity = scope.workspaceIdentity?.trim();
    return {
        workspace_kind: identity || scope.remoteSessionId?.trim() ? "remote" : "local",
        remote_kind: identity ? (parseRemoteWorkspaceIdentity(identity)?.kind ?? "") : "",
    };
}
function buildResultDetail(result, errorCategory) {
    return {
        result,
        error_category: result === "failure" ? (errorCategory ?? "unknown") : "",
    };
}
function buildWebRemoteControlEvent(elementName, eventType, eventExtraDetail) {
    return {
        elementName,
        eventRegion: "web_remote_control",
        eventType,
        eventExtraDetail,
    };
}
export function buildRemoteWorkspaceConnectResultTelemetry(input) {
    return {
        elementName: "remote_workspace_connect_result",
        eventRegion: "remote_workspace",
        eventType: "result",
        eventExtraDetail: {
            result: input.result,
            remote_kind: input.remoteKind,
            connect_trigger: input.connectTrigger,
            error_category: input.result === "success" ? "" : (input.errorCategory ?? "unknown"),
        },
    };
}
export function buildWebRemoteControlEntryViewTelemetry(input) {
    return buildWebRemoteControlEvent("web_remote_control_entry_view", "view", {
        workspace_kind: input.workspaceKind,
        remote_kind: input.remoteKind ?? "",
    });
}
export function buildWebRemoteControlStartResultTelemetry(input) {
    return buildWebRemoteControlEvent("web_remote_control_start_result", "result", {
        ...buildResultDetail(input.result, input.errorCategory),
        workspace_kind: input.workspaceKind,
        remote_kind: input.remoteKind ?? "",
    });
}
export function buildWebRemoteControlPairResultTelemetry(input) {
    return buildWebRemoteControlEvent("web_remote_control_pair_result", "result", {
        ...buildResultDetail(input.result, input.errorCategory),
        pair_kind: input.pairKind,
        workspace_kind: input.workspaceKind,
        remote_kind: input.remoteKind ?? "",
    });
}
export function buildWebRemoteControlBridgeResultTelemetry(input) {
    return buildWebRemoteControlEvent("web_remote_control_bridge_result", "result", {
        ...buildResultDetail(input.result, input.errorCategory),
        workspace_kind: input.workspaceKind,
        remote_kind: input.remoteKind ?? "",
        entry_kind: input.entryKind,
    });
}
function readErrorSearchText(error) {
    if (typeof error === "string") {
        return error.toLowerCase();
    }
    if (typeof error !== "object" || error === null) {
        return "";
    }
    const code = "code" in error ? String(error.code ?? "") : "";
    const message = "message" in error ? String(error.message ?? "") : "";
    return `${code} ${message}`.toLowerCase();
}
/**
 * 原始错误只在本地参与匹配，返回值固定为低基数枚举，禁止把远端目标或错误消息带入埋点。
 */
export function classifyRemoteUsageError(error) {
    const value = readErrorSearchText(error);
    if (/(auth|password|credential|token|permission|denied|unauthor)/.test(value)) {
        return "auth";
    }
    if (/(deploy|download|install|asset|checksum)/.test(value)) {
        return "deploy";
    }
    if (/(host_start|host start|spawn|process.*(?:exit|start)|host.*(?:exit|start))/.test(value)) {
        return "host_start";
    }
    if (/(attach|desktop_host_missing|workspace.*(?:identity|missing|mismatch)|remote_session)/.test(value)) {
        return "attach";
    }
    if (/(relay|websocket|web socket|pair|device.*(?:kicked|not.found))/.test(value)) {
        return "relay";
    }
    if (/(connect|network|socket|ssh|wsl|docker|server|timeout|timedout|econn)/.test(value)) {
        return "connect";
    }
    return "unknown";
}
//# sourceMappingURL=remoteUsageTelemetry.js.map