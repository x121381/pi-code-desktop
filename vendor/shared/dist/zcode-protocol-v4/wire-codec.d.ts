import type { TopicFrameDeliveryKind, TopicWireFrame, TopicWireFrameCandidate } from "./wire.js";
/**
 * 按当前生产三层真实承载计量 topic notification。mobile relay
 * 会把 Channel binary 再 base64，不能只测 CLI 的 logical JSON。
 */
export declare function measureTopicNotificationEnvelopeBytes(wire: TopicWireFrameCandidate): {
    cliNdjsonBytes: number;
    channelSocketBytes: number;
    mobileRelayBytes: number;
    maxBytes: number;
};
export declare function utf8JsonByteLength(value: unknown): number;
export declare class TopicWireFrameEncodingError extends Error {
    readonly reasonCode: string;
    constructor(reasonCode: string);
}
export interface EncodeTopicWireFramesOptions<F> {
    deliveryKind: TopicFrameDeliveryKind;
    topic: string;
    subscriptionId: string;
    logicalFrameId: string;
    logicalFrameOrdinal: number;
    maxPhysicalFrameBytes?: number;
    maxAssemblyBytes?: number;
    measurePhysicalFrameBytes(wire: TopicWireFrame<F>): number;
}
export declare function encodeTopicWireFrames<F>(frame: F, options: EncodeTopicWireFramesOptions<F>): TopicWireFrame<F>[];
//# sourceMappingURL=wire-codec.d.ts.map