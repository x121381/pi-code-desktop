import type { AcknowledgedRelayOutboundBatch } from "./webRemoteControlAcknowledgedRelayProtocolTypes.js";
export declare class AcknowledgedRelayBatchQueue {
    private storage;
    private headIndex;
    private nextUnsentIndex;
    get oldest(): AcknowledgedRelayOutboundBatch | undefined;
    get nextUnsent(): AcknowledgedRelayOutboundBatch | undefined;
    get activeCount(): number;
    /** 内部有界性测试观察点；不从 @zcode/client public entry 导出。 */
    get retainedStorageSlots(): number;
    get retainedBatchReferenceCount(): number;
    get retainedPayloadBytes(): number;
    append(batch: AcknowledgedRelayOutboundBatch): void;
    advanceUnsent(): void;
    resetReplay(): void;
    releaseThrough(ackMessageSeq: number): {
        releasedBytes: number;
        releasedCount: number;
    };
    clear(): void;
    private compactReleasedPrefix;
}
//# sourceMappingURL=webRemoteControlAcknowledgedRelayBatchQueue.d.ts.map