import { type IMessagePassingProtocol } from "@zcode/rpc";
import type { WebRemoteControlAppPayload, WebRemoteControlRpcFramePayload } from "@zcode/shared";
export { ACKNOWLEDGED_WEB_REMOTE_CONTROL_RELAY_LIMITS, createAcknowledgedWebRemoteControlRelayProtocol, type AcknowledgedWebRemoteControlRelayProtocolAdapter, type AcknowledgedWebRemoteControlRelayProtocolOptions, } from "./webRemoteControlAcknowledgedRelayProtocol.js";
export interface WebRemoteControlRelayProtocolOptions {
    bridgeSessionId: string;
    bridgeGeneration?: number;
    recoveryId?: string;
    sendFrame(frame: WebRemoteControlRpcFramePayload): boolean | void;
    maxBufferedFrames?: number;
    bufferedFrameTimeoutMs?: number | null;
    onBufferedFrameTimeout?(count: number): void;
    onFrameGap?(gap: {
        bridgeSessionId: string;
        seq: number;
        expectedSeq: number;
    }): void;
}
export interface WebRemoteControlRelayProtocolAdapter {
    protocol: IMessagePassingProtocol;
    acceptPayload(payload: WebRemoteControlAppPayload): void;
    flushPendingFrames(): boolean;
    dropBufferedFrames(): number;
    getBridgeSessionId(): string;
    isDegraded(): boolean;
    markDegraded(): void;
    dispose(): void;
}
export declare function createWebRemoteControlRelayProtocol({ bridgeSessionId, bridgeGeneration, recoveryId, sendFrame, maxBufferedFrames, bufferedFrameTimeoutMs, onBufferedFrameTimeout, onFrameGap, }: WebRemoteControlRelayProtocolOptions): WebRemoteControlRelayProtocolAdapter;
//# sourceMappingURL=webRemoteControlRelayProtocol.d.ts.map