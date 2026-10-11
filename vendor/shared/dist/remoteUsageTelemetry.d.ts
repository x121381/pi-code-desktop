import type { RemoteTarget } from "./remoteTarget.js";
import type { TelemetryEventPayload } from "./telemetry.js";
import { type RemoteWorkspaceIdentityKind } from "./remote-workspace-identity.js";
/** 只提取场景枚举；未知远端身份仍为 remote，禁止向业务埋点暴露地址或路径。 */
export declare function resolveWorkspaceTelemetryDetail(scope: {
    workspaceIdentity?: string | null;
    remoteSessionId?: string | null;
}): {
    workspace_kind: "local" | "remote";
    remote_kind: RemoteWorkspaceIdentityKind | "";
};
export type RemoteUsageRemoteKind = RemoteTarget["kind"];
export type RemoteUsageWorkspaceKind = "local" | "remote";
export type RemoteUsageResult = "success" | "failure";
export type WebRemoteControlStartTelemetryResult = RemoteUsageResult | "cancelled";
export type RemoteWorkspaceConnectTrigger = "new" | "reconnect" | "restore";
export type WebRemoteControlPairKind = "initial" | "reconnect";
export type WebRemoteControlEntryKind = "home" | "task";
export type RemoteUsageErrorCategory = "auth" | "connect" | "deploy" | "host_start" | "attach" | "relay" | "unknown";
export declare function buildRemoteWorkspaceConnectResultTelemetry(input: {
    result: RemoteUsageResult;
    remoteKind: RemoteUsageRemoteKind;
    connectTrigger: RemoteWorkspaceConnectTrigger;
    errorCategory?: RemoteUsageErrorCategory;
}): TelemetryEventPayload;
export declare function buildWebRemoteControlEntryViewTelemetry(input: {
    workspaceKind: RemoteUsageWorkspaceKind;
    remoteKind?: RemoteUsageRemoteKind;
}): TelemetryEventPayload;
export declare function buildWebRemoteControlStartResultTelemetry(input: {
    result: WebRemoteControlStartTelemetryResult;
    workspaceKind: RemoteUsageWorkspaceKind;
    remoteKind?: RemoteUsageRemoteKind;
    errorCategory?: RemoteUsageErrorCategory;
}): TelemetryEventPayload;
export declare function buildWebRemoteControlPairResultTelemetry(input: {
    result: RemoteUsageResult;
    pairKind: WebRemoteControlPairKind;
    workspaceKind: RemoteUsageWorkspaceKind;
    remoteKind?: RemoteUsageRemoteKind;
    errorCategory?: RemoteUsageErrorCategory;
}): TelemetryEventPayload;
export declare function buildWebRemoteControlBridgeResultTelemetry(input: {
    result: RemoteUsageResult;
    workspaceKind: RemoteUsageWorkspaceKind;
    remoteKind?: RemoteUsageRemoteKind;
    entryKind: WebRemoteControlEntryKind;
    errorCategory?: RemoteUsageErrorCategory;
}): TelemetryEventPayload;
/**
 * 原始错误只在本地参与匹配，返回值固定为低基数枚举，禁止把远端目标或错误消息带入埋点。
 */
export declare function classifyRemoteUsageError(error: unknown): RemoteUsageErrorCategory;
//# sourceMappingURL=remoteUsageTelemetry.d.ts.map