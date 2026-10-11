import type { MobileSessionCreateTelemetry } from "./sessionCreateTelemetry.js";
import type { DockerContainerInfo, SSHConfigAliasOption, WSLDistro } from "./platform.js";
import type { CreateTempTextAttachmentRequest, CreateTempTextAttachmentResult } from "./platform.js";
import type { LoadCliMcpFromUserDirectoryRequest, LoadCliMcpFromUserDirectoryResult, MigrateLegacyCommonMcpRequest, MigrateLegacyCommonMcpResult, SaveCliMcpToUserDirectoryRequest } from "./mcp.js";
import type { ZCodeProvider } from "./zcode-task-types-core.js";
import type { SessionWorkflowActivity } from "./zcode-protocol-v4/sessions-index-workflow-activity.js";
import type { WebRemoteControlRpcTransportPayload } from "./web-remote-control-rpc-transport.js";
import type { WorkspacePurpose } from "./workspacePurpose.js";
export declare const WEB_REMOTE_CONTROL_WORKSPACE_RECONNECT_TIMEOUT_MS = 120000;
export declare const WEB_REMOTE_CONTROL_OUTBOUND_PAYLOAD_BUFFER_TIMEOUT_MS = 5000;
export type WebRemoteControlThemeSeed = "light" | "dark" | "zai-light" | "zai-dark" | "system";
export interface WebRemoteControlContext {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    initialTaskId?: string;
    theme?: WebRemoteControlThemeSeed;
}
export type WebRemoteControlStatusKind = "idle" | "starting" | "running" | "connecting" | "active" | "error";
export type WebRemoteControlFailureReason = "session-not-found" | "session-expired" | "session-conflict" | "workspace-closed" | "desktop-disconnected" | "invalid-mobile-connection" | "desktop-bootstrap-timeout" | "connection-recovery-timeout" | "relay-unavailable" | "unsupported-action" | "unexpected-error";
export interface WebRemoteControlFailure {
    reason: WebRemoteControlFailureReason;
    message?: string;
}
export declare function createWebRemoteControlConnectionRecoveryTimeoutFailure(message: string): WebRemoteControlFailure;
export interface WebRemoteControlRelayDeviceMeta {
    platform: string;
    version: string;
    name: string;
}
export interface WebRemoteControlMobileViewportInfo {
    width: number;
    height: number;
    devicePixelRatio: number;
}
export interface WebRemoteControlMobileScreenInfo {
    width: number;
    height: number;
}
export interface WebRemoteControlMobileDeviceInfo extends WebRemoteControlRelayDeviceMeta {
    userAgent?: string;
    language?: string;
    languages?: string[];
    browserPlatform?: string;
    viewport?: WebRemoteControlMobileViewportInfo;
    screen?: WebRemoteControlMobileScreenInfo;
    timezone?: string;
    online?: boolean;
    updatedAt: number;
}
export type WebRemoteControlRelayRole = "device" | "terminal";
export type WebRemoteControlRelayPairStatus = "waiting" | "matched";
export type WebRemoteControlRelayErrorCode = "AUTH_FAILED" | "DEVICE_OFFLINE" | "KICKED" | "WRONG_PARAM" | "INTERNAL";
export interface WebRemoteControlRelayOutgoingBase {
    client_ts?: number;
}
export interface WebRemoteControlRelayIncomingBase {
    server_ts?: number;
}
export interface WebRemoteControlRelayDeviceRegisterInit extends WebRemoteControlRelayOutgoingBase {
    type: "device_register_init";
    device_mid: string;
    pass_hash: string;
    meta: WebRemoteControlRelayDeviceMeta;
}
export interface WebRemoteControlRelayDeviceRegisterAck extends WebRemoteControlRelayIncomingBase {
    type: "device_register_ack";
    device_sid: string;
}
export interface WebRemoteControlRelayAuthInit extends WebRemoteControlRelayOutgoingBase {
    type: "auth_init";
    role: WebRemoteControlRelayRole;
    device_sid: string;
    meta: WebRemoteControlRelayDeviceMeta;
}
export interface WebRemoteControlRelayAuthChallenge extends WebRemoteControlRelayIncomingBase {
    type: "auth_challenge";
    nonce: string;
}
export interface WebRemoteControlRelayAuthResponse extends WebRemoteControlRelayOutgoingBase {
    type: "auth_response";
    device_sid: string;
    proof: string;
}
export interface WebRemoteControlRelayAuthAck extends WebRemoteControlRelayIncomingBase {
    type: "auth_ack";
    device_sid: string;
    terminal_sid?: string;
    pair_status: WebRemoteControlRelayPairStatus;
}
export interface WebRemoteControlRelayPairStatusQuery extends WebRemoteControlRelayOutgoingBase {
    type: "pair_status_query";
    device_sid: string;
}
export interface WebRemoteControlRelayPairStatusAck extends WebRemoteControlRelayIncomingBase {
    type: "pair_status_ack";
    terminal_sid?: string;
    pair_status: WebRemoteControlRelayPairStatus;
}
export interface WebRemoteControlRelayDataMessage<TPayload = unknown> extends WebRemoteControlRelayOutgoingBase, WebRemoteControlRelayIncomingBase {
    type: "data";
    payload: TPayload;
}
export interface WebRemoteControlRelayError extends WebRemoteControlRelayIncomingBase {
    type: "error";
    code: WebRemoteControlRelayErrorCode;
    message: string;
}
export type WebRemoteControlRelayOutgoingMessage = WebRemoteControlRelayDeviceRegisterInit | WebRemoteControlRelayAuthInit | WebRemoteControlRelayAuthResponse | WebRemoteControlRelayPairStatusQuery | WebRemoteControlRelayDataMessage<WebRemoteControlAppPayload>;
export type WebRemoteControlRelayIncomingMessage = WebRemoteControlRelayDeviceRegisterAck | WebRemoteControlRelayAuthChallenge | WebRemoteControlRelayAuthAck | WebRemoteControlRelayPairStatusAck | WebRemoteControlRelayDataMessage<WebRemoteControlAppPayload> | WebRemoteControlRelayError;
export interface WebRemoteControlRelayAuthProofVector {
    passHash: string;
    nonce: string;
    role: WebRemoteControlRelayRole;
    deviceSid: string;
    proof: string;
}
export declare const WEB_REMOTE_CONTROL_RELAY_AUTH_PROOF_VECTORS: WebRemoteControlRelayAuthProofVector[];
export interface WebRemoteControlExternalQrParams {
    deviceSid: string;
    passHash: string;
    timestamp: number;
    deviceMid?: string;
    deviceName?: string;
    appVersion?: string;
    theme?: WebRemoteControlThemeSeed;
}
export interface BuildWebRemoteControlExternalQrUrlOptions extends WebRemoteControlExternalQrParams {
    baseUrl: string;
}
export declare function isWebRemoteControlThemeSeed(value: unknown): value is WebRemoteControlThemeSeed;
export declare function resolveWebRemoteControlRoutePathFromBaseUrl(baseUrl: string): string;
export declare function matchesWebRemoteControlRoutePath(pathname: string, routePath: string): boolean;
export declare function buildWebRemoteControlExternalQrUrl({ baseUrl, deviceSid, passHash, timestamp, deviceMid, deviceName, appVersion, theme, }: BuildWebRemoteControlExternalQrUrlOptions): string;
export declare function parseWebRemoteControlExternalQrParams(params: URLSearchParams): WebRemoteControlExternalQrParams | null;
export type WebRemoteControlTokenKind = "window-pairing";
export type WebRemoteControlWindowFailureReason = WebRemoteControlFailureReason;
export declare const WebRemoteControlCloseCodes: {
    readonly SessionNotFound: 4004;
    readonly SessionConflict: 4009;
    readonly DesktopDisconnected: 4010;
    readonly SessionExpired: 4011;
    readonly WorkspaceClosed: 4012;
    readonly InvalidMobileConnection: 4013;
};
export declare function resolveWebRemoteControlFailureReasonFromCloseCode(code: number): WebRemoteControlFailureReason | null;
export interface WebRemoteControlStartResult {
    status: Extract<WebRemoteControlStatusKind, "running" | "connecting" | "active">;
    sessionId: string;
    windowControlSessionId?: string;
    deviceToken?: string;
    tokenKind?: WebRemoteControlTokenKind;
    expiresAt?: number;
    qrUrl: string;
    connectUrl: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    initialTaskId?: string;
}
export interface WebRemoteControlStartCancelledResult {
    status: "cancelled";
}
/** 兼容仍可返回取消终态的平台实现；当前 Desktop 启动和刷新链路不会产生该结果。 */
export type WebRemoteControlStartOperationResult = WebRemoteControlStartResult | WebRemoteControlStartCancelledResult;
export interface WebRemoteControlStatus {
    status: WebRemoteControlStatusKind;
    sessionId?: string;
    windowControlSessionId?: string;
    deviceToken?: string;
    tokenKind?: WebRemoteControlTokenKind;
    expiresAt?: number;
    mobileConnected?: boolean;
    mobileViewState?: WebRemoteControlMobileViewState;
    mobileDeviceInfo?: WebRemoteControlMobileDeviceInfo;
    qrUrl?: string;
    connectUrl?: string;
    workspacePath?: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    initialTaskId?: string;
    error?: string;
    failure?: WebRemoteControlFailure;
}
export interface WebRemoteControlSessionCreateRequest {
    tunnelId: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    initialTaskId?: string;
}
export interface WebRemoteControlSessionCreateResponse extends WebRemoteControlStartResult {
    token: string;
}
export interface WebRemoteControlWindowSession {
    windowControlSessionId: string;
    deviceToken: string;
    tokenKind: WebRemoteControlTokenKind;
    connectUrl: string;
    qrUrl: string;
    expiresAt: number;
    status: "idle" | "starting" | "running" | "active" | "error";
}
export interface WebRemoteControlBootstrapResult {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    initialTaskId?: string;
    wsUrl: string;
}
export interface WebRemoteControlBootstrapErrorResponse {
    error: string;
    reason: WebRemoteControlFailureReason;
}
export interface WebRemoteControlPlatformMethodArgsMap {
    isDockerAvailable: undefined;
    listWSLDistros: undefined;
    listDockerContainers: undefined;
    listSSHConfigAliases: undefined;
    createTempTextAttachment: CreateTempTextAttachmentRequest;
    loadMcpFromUserDirectory: LoadCliMcpFromUserDirectoryRequest | undefined;
    saveMcpToUserDirectory: SaveCliMcpToUserDirectoryRequest;
    migrateLegacyCommonMcp: MigrateLegacyCommonMcpRequest | undefined;
}
export interface WebRemoteControlPlatformMethodResultMap {
    isDockerAvailable: boolean;
    listWSLDistros: WSLDistro[];
    listDockerContainers: DockerContainerInfo[];
    listSSHConfigAliases: SSHConfigAliasOption[];
    createTempTextAttachment: CreateTempTextAttachmentResult;
    loadMcpFromUserDirectory: LoadCliMcpFromUserDirectoryResult;
    saveMcpToUserDirectory: {
        success: boolean;
        error?: string;
    };
    migrateLegacyCommonMcp: MigrateLegacyCommonMcpResult;
}
export type WebRemoteControlPlatformMethod = keyof WebRemoteControlPlatformMethodResultMap;
export type WebRemoteControlPlatformRequest = {
    [K in WebRemoteControlPlatformMethod]: {
        type: "platform-request";
        requestId: string;
        method: K;
        args?: WebRemoteControlPlatformMethodArgsMap[K];
    };
}[WebRemoteControlPlatformMethod];
export type WebRemoteControlPlatformSuccessResponse = {
    [K in WebRemoteControlPlatformMethod]: {
        type: "platform-response";
        requestId: string;
        method: K;
        success: true;
        result: WebRemoteControlPlatformMethodResultMap[K];
    };
}[WebRemoteControlPlatformMethod];
export interface WebRemoteControlPlatformErrorResponse {
    type: "platform-response";
    requestId: string;
    method: WebRemoteControlPlatformMethod;
    success: false;
    error: string;
}
export type WebRemoteControlPlatformResponse = WebRemoteControlPlatformSuccessResponse | WebRemoteControlPlatformErrorResponse;
export interface WebRemoteControlExternalLocalWorkspaceBridge {
    bridgeSessionId: string;
    bridgeGeneration?: number;
    recoveryId?: string;
    kind: "local";
    workspaceKey: string;
    workspacePath: string;
    initialTaskId?: string;
}
export interface WebRemoteControlExternalRemoteWorkspaceBridge {
    bridgeSessionId: string;
    bridgeGeneration?: number;
    recoveryId?: string;
    kind: "remote";
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity: string;
    remoteSessionId: string;
    initialTaskId?: string;
}
export type WebRemoteControlExternalWorkspaceBridge = WebRemoteControlExternalLocalWorkspaceBridge | WebRemoteControlExternalRemoteWorkspaceBridge;
export interface WebRemoteControlBootstrapRequestPayload {
    zcode_type: "bootstrap-request";
    requestId: string;
}
export interface WebRemoteControlBootstrapResponsePayload {
    zcode_type: "bootstrap-response";
    requestId: string;
    success: true;
    result: WebRemoteControlWindowBootstrapResult;
}
export interface WebRemoteControlWorkspaceListRequestPayload {
    zcode_type: "workspace-list-request";
    requestId: string;
}
export interface WebRemoteControlWorkspaceListResponsePayload {
    zcode_type: "workspace-list-response";
    requestId: string;
    success: true;
    result: WebRemoteControlWorkspaceListResult;
}
export interface WebRemoteControlWorkspaceListUpdatedPayload {
    zcode_type: "workspace-list-updated";
    result: WebRemoteControlWorkspaceListResult;
}
export interface WebRemoteControlWorkspaceBridgeOpenPayload {
    zcode_type: "workspace-bridge-open";
    requestId: string;
    bridgeSessionId: string;
    bridgeGeneration?: number;
    recoveryId?: string;
    workspaceKey: string;
    taskId?: string;
}
export interface WebRemoteControlWorkspaceBridgeReadyPayload {
    zcode_type: "workspace-bridge-ready";
    requestId: string;
    bridgeSessionId: string;
    bridgeGeneration?: number;
    recoveryId?: string;
    bridge: WebRemoteControlExternalWorkspaceBridge;
}
export interface WebRemoteControlWorkspaceBridgeErrorPayload {
    zcode_type: "workspace-bridge-error";
    requestId: string;
    bridgeSessionId?: string;
    bridgeGeneration?: number;
    recoveryId?: string;
    reason: WebRemoteControlFailureReason;
    error: string;
}
export interface WebRemoteControlWorkspaceReconnectRequestPayload {
    zcode_type: "workspace-reconnect-request";
    requestId: string;
    workspaceKey: string;
}
export type WebRemoteControlWorkspaceReconnectResponsePayload = {
    zcode_type: "workspace-reconnect-response";
    requestId: string;
    workspaceKey: string;
    success: true;
} | {
    zcode_type: "workspace-reconnect-response";
    requestId: string;
    workspaceKey: string;
    success: false;
    error: string;
};
export interface WebRemoteControlMobileViewStatePayload {
    zcode_type: "mobile-view-state-update";
    viewState: WebRemoteControlMobileViewState;
    deviceInfo?: WebRemoteControlMobileDeviceInfo;
}
export type WebRemoteControlPlatformRequestPayload = {
    [K in WebRemoteControlPlatformMethod]: {
        zcode_type: "platform-request";
        requestId: string;
        method: K;
        args?: WebRemoteControlPlatformMethodArgsMap[K];
    };
}[WebRemoteControlPlatformMethod];
export type WebRemoteControlPlatformResponsePayload = {
    [K in WebRemoteControlPlatformMethod]: {
        zcode_type: "platform-response";
        requestId: string;
        method: K;
        success: true;
        result: WebRemoteControlPlatformMethodResultMap[K];
    };
}[WebRemoteControlPlatformMethod] | {
    zcode_type: "platform-response";
    requestId: string;
    method: WebRemoteControlPlatformMethod;
    success: false;
    error: string;
};
/** @deprecated 仅供 legacy adapter 单测/迁移使用；production parser 自 04D-3 起拒绝。 */
export interface WebRemoteControlRpcFramePayload {
    zcode_type: "rpc-frame";
    bridgeSessionId: string;
    bridgeGeneration?: number;
    recoveryId?: string;
    seq: number;
    dataBase64: string;
}
export interface WebRemoteControlBridgeDegradedPayload {
    zcode_type: "bridge-degraded";
    bridgeSessionId: string;
    bridgeGeneration?: number;
    recoveryId?: string;
    reason: "rpc-transport-fault" | "rpc-frame-gap" | "buffer-overflow" | "buffer-timeout";
    seq?: number;
    expectedSeq?: number;
    droppedCount?: number;
}
export interface WebRemoteControlAppErrorPayload {
    zcode_type: "app-error";
    requestId?: string;
    bridgeSessionId?: string;
    reason: WebRemoteControlFailureReason;
    error: string;
}
export type WebRemoteControlMobileDiagnosticEvent = "state-transition" | "socket-close" | "socket-error" | "recover-start" | "recover-scheduled" | "pair-status" | "failure";
export interface WebRemoteControlMobileDiagnosticPayload {
    zcode_type: "mobile-diagnostic";
    event: WebRemoteControlMobileDiagnosticEvent;
    timestamp: number;
    state?: string;
    previousState?: string;
    pairStatus?: WebRemoteControlRelayPairStatus;
    closeCode?: number;
    closeReason?: string;
    wasClean?: boolean;
    wasPaired?: boolean;
    failureReason?: WebRemoteControlFailureReason;
    failureMessage?: string;
    visibilityState?: string;
    online?: boolean;
    hiddenDurationMs?: number;
}
export type WebRemoteControlAppPayload = {
    zcode_type: "telemetry-report";
    event: MobileSessionCreateTelemetry;
} | WebRemoteControlBootstrapRequestPayload | WebRemoteControlBootstrapResponsePayload | WebRemoteControlWorkspaceListRequestPayload | WebRemoteControlWorkspaceListResponsePayload | WebRemoteControlWorkspaceListUpdatedPayload | WebRemoteControlWorkspaceBridgeOpenPayload | WebRemoteControlWorkspaceBridgeReadyPayload | WebRemoteControlWorkspaceBridgeErrorPayload | WebRemoteControlWorkspaceReconnectRequestPayload | WebRemoteControlWorkspaceReconnectResponsePayload | WebRemoteControlMobileViewStatePayload | WebRemoteControlPlatformRequestPayload | WebRemoteControlPlatformResponsePayload | WebRemoteControlRpcTransportPayload | WebRemoteControlBridgeDegradedPayload | WebRemoteControlAppErrorPayload | WebRemoteControlMobileDiagnosticPayload;
export interface WebRemoteControlWorkspaceTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    label: string;
    workspacePurpose?: WorkspacePurpose;
    kind: "local" | "remote";
    connectionState?: "connected" | "disconnected" | "reconnecting";
    lastConnectionError?: string;
}
export interface WebRemoteControlReconnectWorkspaceRequest {
    requestId: string;
    workspaceKey: string;
}
export type WebRemoteControlReconnectWorkspaceResult = {
    requestId: string;
    workspaceKey: string;
    success: true;
} | {
    requestId: string;
    workspaceKey: string;
    success: false;
    error: string;
};
export type WebRemoteControlTaskDisplayStatus = "idle" | "running" | "completed" | "error";
export interface WebRemoteControlTaskTarget {
    taskId: string;
    title: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    workspaceLabel: string;
    workspaceKind: "local" | "remote";
    createdAt: number;
    updatedAt: number;
    provider?: ZCodeProvider;
    unreadAt?: number;
    displayStatus?: WebRemoteControlTaskDisplayStatus;
    hasBackgroundWork?: boolean;
    workflowActivity?: SessionWorkflowActivity;
    pinned?: boolean;
    archived?: boolean;
}
export interface WebRemoteControlWorkspaceListResult {
    workspaces: WebRemoteControlWorkspaceTarget[];
    tasks?: WebRemoteControlTaskTarget[];
    activeWorkspaceKey?: string;
    activeTaskId?: string;
}
export type WebRemoteControlMobileNavigationIntent = "chat";
export interface WebRemoteControlWorkspaceSwitchOptions {
    taskId?: string;
    mobileNavigationIntent?: WebRemoteControlMobileNavigationIntent;
    /** 仅由手机任务首页使用；目标 bridge 建立后只清除这次快照对应的未读。 */
    markTaskReadExpectedUnreadAt?: number;
}
export interface WebRemoteControlWorkspaceSwitchResult extends WebRemoteControlSessionCreateResponse {
}
export interface WebRemoteControlMobileViewState {
    activeWorkspaceKey?: string;
    activeTaskId?: string;
    updatedAt: number;
}
export interface WebRemoteControlLocalWorkspaceBridge {
    bridgeSessionId: string;
    bridgeToken: string;
    kind: "local";
    workspaceKey: string;
    workspacePath: string;
    initialTaskId?: string;
    wsUrl: string;
}
export interface WebRemoteControlRemoteWorkspaceBridge {
    bridgeSessionId: string;
    bridgeToken: string;
    kind: "remote";
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity: string;
    remoteSessionId: string;
    initialTaskId?: string;
    wsUrl: string;
}
export type WebRemoteControlWorkspaceBridge = WebRemoteControlLocalWorkspaceBridge | WebRemoteControlRemoteWorkspaceBridge;
export interface WebRemoteControlWindowBootstrapResult {
    windowControlSessionId: string;
    /** 当前连接的桌面实际版本；旧桌面缺失时手机保留原 URL。 */
    desktopAppVersion?: string;
    workspaces: WebRemoteControlWorkspaceTarget[];
    tasks: WebRemoteControlTaskTarget[];
    initialViewState?: WebRemoteControlMobileViewState;
    mobileViewState?: WebRemoteControlMobileViewState;
}
export interface WebRemoteControlWindowControlReadyEvent {
    type: "window-control-ready";
    windowControlSessionId: string;
    mobileConnectionId: string;
    expiresAt: number;
}
export declare function resolveWebRemoteControlWorkspaceKey(target: Pick<WebRemoteControlWorkspaceTarget, "workspacePath" | "workspaceIdentity">): string;
export declare function resolveWebRemoteControlInitialWorkspaceSelection({ workspaces, mobileViewState, initialViewState, }: {
    workspaces: WebRemoteControlWorkspaceTarget[];
    mobileViewState?: WebRemoteControlMobileViewState;
    initialViewState?: WebRemoteControlMobileViewState;
}): {
    workspaceKey: string;
    taskId?: string;
    canBridge: boolean;
} | null;
export interface WebRemoteControlWorkspaceListRequest {
    type: "workspace-list-request";
    requestId: string;
    sessionId: string;
}
export interface WebRemoteControlWorkspaceSwitchRequest {
    type: "workspace-switch-request";
    requestId: string;
    sessionId: string;
    workspaceKey: string;
    taskId?: string;
}
export interface WebRemoteControlWorkspaceListSuccessResponse {
    type: "workspace-list-response";
    requestId: string;
    sessionId: string;
    success: true;
    result: WebRemoteControlWorkspaceListResult;
}
export interface WebRemoteControlWorkspaceSwitchSuccessResponse {
    type: "workspace-switch-response";
    requestId: string;
    sessionId: string;
    success: true;
    result: WebRemoteControlWorkspaceSwitchResult;
}
export interface WebRemoteControlWorkspaceListErrorResponse {
    type: "workspace-list-response";
    requestId: string;
    sessionId: string;
    success: false;
    error: string;
}
export interface WebRemoteControlWorkspaceSwitchErrorResponse {
    type: "workspace-switch-response";
    requestId: string;
    sessionId: string;
    success: false;
    error: string;
}
export type WebRemoteControlWorkspaceControlRequest = WebRemoteControlWorkspaceListRequest | WebRemoteControlWorkspaceSwitchRequest;
export type WebRemoteControlWorkspaceControlResponse = WebRemoteControlWorkspaceListSuccessResponse | WebRemoteControlWorkspaceSwitchSuccessResponse | WebRemoteControlWorkspaceListErrorResponse | WebRemoteControlWorkspaceSwitchErrorResponse;
export interface WebRemoteControlWindowBootstrapRequest {
    type: "window-bootstrap-request";
    requestId: string;
    windowControlSessionId: string;
}
export interface WebRemoteControlWindowBootstrapSuccessResponse {
    type: "window-bootstrap-response";
    requestId: string;
    windowControlSessionId: string;
    success: true;
    result: WebRemoteControlWindowBootstrapResult;
}
export interface WebRemoteControlWindowBootstrapErrorResponse {
    type: "window-bootstrap-response";
    requestId: string;
    windowControlSessionId: string;
    success: false;
    error: string;
}
export interface WebRemoteControlWorkspaceBridgeRequest {
    type: "workspace-bridge-request";
    requestId: string;
    windowControlSessionId: string;
    bridgeSessionId: string;
    bridgeToken: string;
    workspaceKey: string;
    taskId?: string;
}
export interface WebRemoteControlWorkspaceBridgeSuccessResponse {
    type: "workspace-bridge-response";
    requestId: string;
    windowControlSessionId: string;
    success: true;
    bridge: WebRemoteControlWorkspaceBridge;
}
export interface WebRemoteControlWorkspaceBridgeErrorResponse {
    type: "workspace-bridge-response";
    requestId: string;
    windowControlSessionId: string;
    success: false;
    error: string;
}
export interface WebRemoteControlMobileViewStateUpdate {
    type: "mobile-view-state-update";
    windowControlSessionId: string;
    viewState: WebRemoteControlMobileViewState;
    deviceInfo?: WebRemoteControlMobileDeviceInfo;
}
export type WebRemoteControlWindowControlRequest = WebRemoteControlWindowBootstrapRequest | WebRemoteControlWorkspaceBridgeRequest | WebRemoteControlMobileViewStateUpdate;
export type WebRemoteControlWindowControlResponse = WebRemoteControlWindowBootstrapSuccessResponse | WebRemoteControlWindowBootstrapErrorResponse | WebRemoteControlWorkspaceBridgeSuccessResponse | WebRemoteControlWorkspaceBridgeErrorResponse;
export type RelayDesktopControlEvent = {
    type: "tunnel-registered";
    tunnelId: string;
} | {
    type: "window-control-registered";
    tunnelId: string;
} | {
    type: "web-remote-control-session-request";
    sessionId: string;
} | {
    type: "mobile-connected";
    windowControlSessionId: string;
} | {
    type: "mobile-disconnected";
    windowControlSessionId: string;
} | WebRemoteControlPlatformRequest | WebRemoteControlPlatformResponse | WebRemoteControlWorkspaceControlRequest | WebRemoteControlWorkspaceControlResponse | WebRemoteControlWindowControlRequest | WebRemoteControlWindowControlResponse;
//# sourceMappingURL=web-remote-control.d.ts.map