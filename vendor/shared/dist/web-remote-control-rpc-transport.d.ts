import { z } from "zod";
export declare const WEB_REMOTE_CONTROL_RPC_TRANSPORT_LIMITS: {
    readonly maxPhysicalFrameBytes: number;
    readonly maxMessageBytes: number;
    readonly maxFragments: 64;
    readonly assemblyTimeoutMs: 30000;
    readonly transportIdMaxChars: 256;
};
export declare const webRemoteControlRpcTransportIdSchema: z.ZodString;
export declare const webRemoteControlRpcTransportIdentitySchema: z.ZodObject<{
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type WebRemoteControlRpcTransportIdentity = z.infer<typeof webRemoteControlRpcTransportIdentitySchema>;
export declare const webRemoteControlRpcTransportChecksumSchema: z.ZodObject<{
    algorithm: z.ZodLiteral<"crc32">;
    value: z.ZodString;
}, z.core.$strict>;
export type WebRemoteControlRpcTransportChecksum = z.infer<typeof webRemoteControlRpcTransportChecksumSchema>;
export declare const webRemoteControlRpcTransportFrameSchema: z.ZodObject<{
    zcode_type: z.ZodLiteral<"rpc-frame">;
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    messageSeq: z.ZodNumber;
    fragmentIndex: z.ZodNumber;
    fragmentCount: z.ZodNumber;
    messageBytes: z.ZodNumber;
    checksum: z.ZodObject<{
        algorithm: z.ZodLiteral<"crc32">;
        value: z.ZodString;
    }, z.core.$strict>;
    dataBase64: z.ZodString;
}, z.core.$strict>;
export type WebRemoteControlRpcTransportFramePayload = z.infer<typeof webRemoteControlRpcTransportFrameSchema>;
export declare const webRemoteControlRpcTransportAckSchema: z.ZodObject<{
    zcode_type: z.ZodLiteral<"rpc-frame-ack">;
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    ackMessageSeq: z.ZodNumber;
}, z.core.$strict>;
export type WebRemoteControlRpcTransportAckPayload = z.infer<typeof webRemoteControlRpcTransportAckSchema>;
export declare const webRemoteControlRpcTransportPayloadSchema: z.ZodUnion<readonly [z.ZodObject<{
    zcode_type: z.ZodLiteral<"rpc-frame">;
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    messageSeq: z.ZodNumber;
    fragmentIndex: z.ZodNumber;
    fragmentCount: z.ZodNumber;
    messageBytes: z.ZodNumber;
    checksum: z.ZodObject<{
        algorithm: z.ZodLiteral<"crc32">;
        value: z.ZodString;
    }, z.core.$strict>;
    dataBase64: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"rpc-frame-ack">;
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    ackMessageSeq: z.ZodNumber;
}, z.core.$strict>]>;
export type WebRemoteControlRpcTransportPayload = z.infer<typeof webRemoteControlRpcTransportPayloadSchema>;
export declare const webRemoteControlRpcRelayEnvelopeSchema: z.ZodObject<{
    type: z.ZodLiteral<"data">;
    payload: z.ZodUnion<readonly [z.ZodObject<{
        zcode_type: z.ZodLiteral<"rpc-frame">;
        bridgeSessionId: z.ZodString;
        bridgeGeneration: z.ZodOptional<z.ZodNumber>;
        recoveryId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        messageSeq: z.ZodNumber;
        fragmentIndex: z.ZodNumber;
        fragmentCount: z.ZodNumber;
        messageBytes: z.ZodNumber;
        checksum: z.ZodObject<{
            algorithm: z.ZodLiteral<"crc32">;
            value: z.ZodString;
        }, z.core.$strict>;
        dataBase64: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        zcode_type: z.ZodLiteral<"rpc-frame-ack">;
        bridgeSessionId: z.ZodString;
        bridgeGeneration: z.ZodOptional<z.ZodNumber>;
        recoveryId: z.ZodOptional<z.ZodString>;
        ackMessageSeq: z.ZodNumber;
    }, z.core.$strict>]>;
    client_ts: z.ZodOptional<z.ZodNumber>;
    server_ts: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type WebRemoteControlRpcRelayEnvelope = z.infer<typeof webRemoteControlRpcRelayEnvelopeSchema>;
export interface WebRemoteControlRpcTransportFault {
    reasonCode: string;
    terminal: boolean;
    seq?: number;
    messageSeq?: number;
    expectedSeq?: number;
    expectedMessageSeq?: number;
}
export type ParseWebRemoteControlRpcRelayEnvelopeResult = {
    kind: "accepted";
    bytes: number;
    envelope: WebRemoteControlRpcRelayEnvelope;
} | {
    kind: "fault";
    fault: WebRemoteControlRpcTransportFault;
};
/** 最终 relay JSON（默认同时含最坏 client/server timestamp）的精确 UTF-8 byte 数。 */
export declare function measureWebRemoteControlRpcRelayEnvelopeBytes(payload: WebRemoteControlRpcTransportPayload, timestamps?: {
    clientTimestamp?: number | null;
    serverTimestamp?: number | null;
}): number;
export declare function parseWebRemoteControlRpcTransportPayload(value: unknown): WebRemoteControlRpcTransportPayload | null;
/** D3 接线时在 JSON.parse 前调用；本切片只提供 standalone primitive。 */
export declare function parseWebRemoteControlRpcRelayEnvelopeJson(rawJson: string, options?: {
    maxPhysicalFrameBytes?: number;
}): ParseWebRemoteControlRpcRelayEnvelopeResult;
export declare class WebRemoteControlRpcTransportEncodingError extends Error {
    readonly reasonCode: string;
    constructor(reasonCode: string);
}
export interface EncodeWebRemoteControlRpcTransportMessageOptions extends WebRemoteControlRpcTransportIdentity {
    firstPhysicalSeq: number;
    messageSeq: number;
    maxPhysicalFrameBytes?: number;
    maxMessageBytes?: number;
    maxFragments?: number;
}
/** raw Channel bytes -> immutable bounded physical payload batch。 */
export declare function encodeWebRemoteControlRpcTransportMessage(bytes: Uint8Array, options: EncodeWebRemoteControlRpcTransportMessageOptions): readonly WebRemoteControlRpcTransportFramePayload[];
export type WebRemoteControlRpcTransportAssemblyEvent = {
    kind: "incomplete";
    messageSeq: number;
    receivedFragments: number;
} | {
    kind: "duplicate";
    ackMessageSeq: number | null;
} | {
    kind: "complete";
    messageSeq: number;
    bytes: Uint8Array;
} | {
    kind: "fault";
    fault: WebRemoteControlRpcTransportFault;
};
export interface WebRemoteControlRpcTransportAssemblerOptions {
    identity: WebRemoteControlRpcTransportIdentity;
    initialPhysicalSeq?: number;
    initialMessageSeq?: number;
    maxPhysicalFrameBytes?: number;
    maxMessageBytes?: number;
    maxFragments?: number;
    timeoutMs?: number;
    now?: () => number;
}
/** 每方向一个实例；任何 terminal fault 后由 04D-2 映射为 bridge degraded。 */
export declare class WebRemoteControlRpcTransportAssembler {
    private readonly identity;
    private readonly maxPhysicalFrameBytes;
    private readonly maxMessageBytes;
    private readonly maxFragments;
    private readonly timeoutMs;
    private readonly now;
    private expectedPhysicalSeq;
    private expectedMessageSeq;
    private lastCompletedMessageSeq;
    private physicalSequenceExhausted;
    private messageSequenceExhausted;
    private settledFrameFingerprintsBySeq;
    private active;
    private terminalReason;
    constructor(options: WebRemoteControlRpcTransportAssemblerOptions);
    get nextExpiryAt(): number | null;
    private fault;
    expire(now?: number): WebRemoteControlRpcTransportAssemblyEvent | null;
    accept(candidate: unknown, now?: number): WebRemoteControlRpcTransportAssemblyEvent;
}
//# sourceMappingURL=web-remote-control-rpc-transport.d.ts.map