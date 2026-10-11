import { type WebRemoteControlAppPayload, type WebRemoteControlRelayDataMessage } from "@zcode/shared";
export type WebRemoteControlPayloadSendResult = {
    kind: "sent";
    bytes: number;
} | {
    kind: "unavailable";
} | {
    kind: "oversize";
    bytes: number;
    maxBytes: number;
};
export interface SerializedWebRemoteControlRelayPayload {
    readonly message: WebRemoteControlRelayDataMessage<WebRemoteControlAppPayload>;
    readonly json: string;
    readonly bytes: number;
}
/**
 * 为同一个 immutable app payload 固定唯一 final relay JSON。
 *
 * Bugfix：旧路径在 meter 与 send 时分别调用 Date.now()/JSON.stringify，导致 replay accounting
 * 记录的并非 WebSocket 实际写入 bytes。WeakMap 让 cache 生命周期跟随 adapter 持有的 frame，
 * cumulative ACK 释放 frame 后即可被 GC，不形成第二个 replay owner。
 */
export declare class WebRemoteControlRelayPayloadSerializer {
    private readonly cache;
    prepare(payload: WebRemoteControlAppPayload, clientTimestamp?: number): SerializedWebRemoteControlRelayPayload;
    isOversize(prepared: SerializedWebRemoteControlRelayPayload): boolean;
}
//# sourceMappingURL=webRemoteControlRelayPayloadSerializer.d.ts.map