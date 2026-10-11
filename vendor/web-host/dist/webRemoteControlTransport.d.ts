import { type WebRemoteControlPayloadSendResult } from "@zcode/client";
import { type WebRemoteControlAppPayload, type WebRemoteControlFailure } from "@zcode/shared";
export type WebRemoteControlTerminalTransportState = "idle" | "connecting" | "authenticating" | "waiting" | "paired" | "reconnecting" | "suspended" | "kicked" | "error";
export type WebRemoteControlTerminalTransportDiagnostic = {
    type: "state-transition";
    previousState: WebRemoteControlTerminalTransportState;
    state: WebRemoteControlTerminalTransportState;
    timestamp: number;
    visibilityState: string;
    online: boolean;
    hiddenDurationMs?: number;
} | {
    type: "socket-close";
    code: number;
    reason: string;
    wasClean: boolean;
    wasPaired: boolean;
    state: WebRemoteControlTerminalTransportState;
    timestamp: number;
    visibilityState: string;
    online: boolean;
    hiddenDurationMs?: number;
} | {
    type: "socket-error" | "recover-start" | "recover-scheduled";
    state: WebRemoteControlTerminalTransportState;
    timestamp: number;
    visibilityState: string;
    online: boolean;
    hiddenDurationMs?: number;
} | {
    type: "pair-status";
    pairStatus: "waiting" | "matched";
    state: WebRemoteControlTerminalTransportState;
    timestamp: number;
    visibilityState: string;
    online: boolean;
    hiddenDurationMs?: number;
} | {
    type: "socket-extensions";
    state: WebRemoteControlTerminalTransportState;
    perMessageDeflate: boolean;
    extensions?: string;
    timestamp: number;
    visibilityState: string;
    online: boolean;
    hiddenDurationMs?: number;
};
interface WebRemoteControlTerminalTransportOptions {
    relayWsUrl: string;
    deviceSid: string;
    passHash: string;
    deviceMid?: string;
    appVersion?: string;
    WebSocketCtor?: typeof globalThis.WebSocket;
    heartbeatIntervalMs?: number;
    heartbeatJitterMs?: number;
    heartbeatAckTimeoutMs?: number;
    reconnectJitterMs?: number;
    healthCheckTimeoutMs?: number;
    desktopOfflineGraceMs?: number;
    staleWaitingRecoveryMs?: number;
    waitingTimeoutMs?: number;
    authProvider: {
        calculateProof(passHash: string, nonce: string, role: "terminal", deviceSid: string): Promise<string>;
    };
    onPayload(payload: WebRemoteControlAppPayload): void;
    onRawTransportPayload?(payload: unknown): boolean;
    onRawTransportFault?(reasonCode: string): void;
    onStateChange(state: WebRemoteControlTerminalTransportState): void;
    onFailure(failure: WebRemoteControlFailure): void;
    onError(error: Error): void;
    onDiagnostic?(diagnostic: WebRemoteControlTerminalTransportDiagnostic): void;
    onSendReady?(event: {
        kind: "same-socket" | "reconnected-socket";
    }): void;
    reloadPage(): void;
}
export declare class WebRemoteControlTerminalTransport {
    private readonly options;
    private readonly WebSocketCtor;
    private socket?;
    private state;
    private intentionallyClosed;
    private wasPaired;
    private hadPairedSession;
    private staleWaitingCount;
    private reconnectAttempt;
    private socketGeneration;
    private lastPairedSocketGeneration;
    private lastPairStatusAckAt;
    private hiddenStartedAt?;
    private lastPairStatusDiagnostic?;
    private pairedWaiters;
    private heartbeatTimer?;
    private heartbeatAckWatchdogTimer?;
    private waitingTimer?;
    private staleWaitingRecoveryTimer?;
    private reconnectTimer?;
    private desktopOfflineFailureTimer?;
    private readonly traceRelayMessages;
    private readonly payloadSerializer;
    constructor(options: WebRemoteControlTerminalTransportOptions);
    start(): void;
    private connect;
    sendPayload(payload: WebRemoteControlAppPayload): boolean;
    measurePayloadBytes(payload: WebRemoteControlAppPayload): number;
    sendPayloadResult(payload: WebRemoteControlAppPayload): WebRemoteControlPayloadSendResult;
    suspend(): void;
    recoverConnection(timeoutMs?: number): Promise<void>;
    recoverInBackground(): void;
    dispose(): void;
    private handleMessage;
    private applyPairStatus;
    private handleRelayError;
    private handleDataPayload;
    private startHeartbeat;
    private scheduleHeartbeat;
    private armHeartbeatAckWatchdog;
    private getReconnectJitterMs;
    private sendPairStatusQuery;
    private stopHeartbeat;
    private startWaitingTimer;
    private clearWaitingTimer;
    private scheduleStaleWaitingRecovery;
    private clearStaleWaitingRecoveryTimer;
    private reconnectAfterStaleWaiting;
    private reconnectNow;
    private scheduleReconnect;
    private recoverFromRelayInternal;
    private recoverFromDeviceOffline;
    private enterWaitingForDeviceAfterRelayError;
    private clearDesktopOfflineFailureTimer;
    private clearReconnectTimer;
    private waitForPaired;
    private resolvePairedWaiters;
    private rejectPairedWaiters;
    private enterTerminalFailure;
    private setState;
    private send;
    private sendSerialized;
    private logRelayTrace;
    private emitDiagnostic;
}
interface WebRemoteControlAppPayloadRequesterOptions {
    sendPayload(payload: WebRemoteControlAppPayload): boolean;
    timeoutMs?: number;
}
interface WebRemoteControlAppPayloadRequestOptions {
    timeoutMs?: number;
}
interface WebRemoteControlRelayRequestRecoveryOptions {
    recoverTimeout?: boolean;
}
export declare function createWebRemoteControlRelayRequestRecovery(recoverConnection: () => Promise<void>): <T>(request: () => Promise<T>, options?: WebRemoteControlRelayRequestRecoveryOptions) => Promise<T>;
export declare function createWebRemoteControlAppPayloadRequester({ sendPayload, timeoutMs: defaultTimeoutMs, }: WebRemoteControlAppPayloadRequesterOptions): {
    requestAppPayload<TResponse extends WebRemoteControlAppPayload>(payload: WebRemoteControlAppPayload & {
        requestId: string;
    }, isMatch: (payload: WebRemoteControlAppPayload) => payload is TResponse, options?: WebRemoteControlAppPayloadRequestOptions): Promise<TResponse>;
    acceptPayload(payload: WebRemoteControlAppPayload): boolean;
    rejectAll(failure: WebRemoteControlFailure): void;
    dispose(): void;
};
export {};
