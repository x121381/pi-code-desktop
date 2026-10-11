import type { ConnectionFlowControl, Event, IMessagePassingProtocol } from "@zcode/rpc";
import { type WebRemoteControlRpcTransportFault, type WebRemoteControlRpcTransportFramePayload, type WebRemoteControlRpcTransportIdentity, type WebRemoteControlRpcTransportPayload } from "@zcode/shared";
export declare const ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS: {
    readonly saturationHighWaterMarkBytes: number;
    readonly saturationLowWaterMarkBytes: number;
    readonly replayBufferMaxBytes: number;
    readonly replayBufferGraceMs: 45000;
    readonly assemblyTimeoutMs: 30000;
};
export interface AcknowledgedWebRemoteControlRelayProtocolOptions extends WebRemoteControlRpcTransportIdentity {
    sendFrame(payload: WebRemoteControlRpcTransportPayload): boolean | void;
    measureFrameBytes?(payload: WebRemoteControlRpcTransportFramePayload): number;
    saturationHighWaterMarkBytes?: number;
    saturationLowWaterMarkBytes?: number;
    replayBufferMaxBytes?: number;
    replayBufferGraceMs?: number;
    assemblyTimeoutMs?: number;
    now?: () => number;
}
export interface AcknowledgedWebRemoteControlRelayProtocolAdapter extends ConnectionFlowControl {
    readonly protocol: IMessagePassingProtocol;
    readonly onDegraded: Event<WebRemoteControlRpcTransportFault>;
    acceptPayload(payload: unknown): boolean;
    flushPendingFrames(): boolean;
    replayUnacknowledged(): boolean;
    getBridgeSessionId(): string;
    isDegraded(): boolean;
    markDegraded(reasonCode?: string): void;
    dispose(): void;
}
export interface AcknowledgedRelayOutboundBatch {
    readonly messageSeq: number;
    readonly frames: readonly WebRemoteControlRpcTransportFramePayload[];
    readonly outerBytes: number;
    readonly queuedAt: number;
    nextFrameIndex: number;
}
export declare function requirePositiveSafeInteger(value: number, name: string): number;
export declare function requireNonnegativeSafeInteger(value: number, name: string): number;
export declare function rawIdentityMatches(identity: WebRemoteControlRpcTransportIdentity, candidate: unknown): boolean;
export declare function isRawTransportCandidate(candidate: unknown): boolean;
export declare function measureAcknowledgedRelayBatchBytes(frames: readonly WebRemoteControlRpcTransportFramePayload[], measureFrameBytes: (frame: WebRemoteControlRpcTransportFramePayload) => number): number;
export interface AcknowledgedRelayResolvedLimits {
    highWaterMarkBytes: number;
    lowWaterMarkBytes: number;
    replayBufferMaxBytes: number;
    replayBufferGraceMs: number;
    assemblyTimeoutMs: number;
}
export declare function resolveAcknowledgedRelayLimits(options: AcknowledgedWebRemoteControlRelayProtocolOptions): AcknowledgedRelayResolvedLimits;
//# sourceMappingURL=webRemoteControlAcknowledgedRelayProtocolTypes.d.ts.map