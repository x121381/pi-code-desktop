import { z } from "zod";
import type { TopicFrameDeliveryKind, TopicWireFrameCandidate } from "./wire.js";
export interface TopicWireAssemblyFault {
    /** 缺失/伪值本身也必须成为 owned typed fault，此时不能伪造用途。 */
    deliveryKind?: TopicFrameDeliveryKind;
    reasonCode: string;
    logicalFrameId: string;
    logicalFrameOrdinal: number;
    topic: string;
    subscriptionId: string;
}
export type TopicWireAssemblyEvent<F> = {
    kind: "complete";
    frame: F;
    deliveryKind: TopicFrameDeliveryKind;
} | {
    kind: "fault";
    fault: TopicWireAssemblyFault;
};
export interface TopicWireFrameAssemblerOptions {
    maxAssemblyBytes?: number;
    maxFragments?: number;
    maxConcurrentAssemblies?: number;
    maxStagedDecodedBytes?: number;
    timeoutMs?: number;
    maxPhysicalFrameBytes?: number;
}
export declare class TopicWireFrameAssembler<F> {
    private readonly frameSchema;
    private readonly assemblies;
    /** 每 route 的单调 ordinal tombstone；不会像 bounded id LRU 一样淘汰后复活旧帧。 */
    private readonly settledByRoute;
    private stagedDecodedBytes;
    private readonly maxAssemblyBytes;
    private readonly maxFragments;
    private readonly maxConcurrentAssemblies;
    private readonly maxStagedDecodedBytes;
    private readonly timeoutMs;
    private readonly maxPhysicalFrameBytes;
    constructor(frameSchema: z.ZodType<F>, options?: TopicWireFrameAssemblerOptions);
    accept(wire: TopicWireFrameCandidate, now?: number): TopicWireAssemblyEvent<F>[];
    expire(now?: number): TopicWireAssemblyEvent<F>[];
    discard(topic: string, subscriptionId: string): void;
    /** fault 后释放该 route 的 active bytes，但保留 ordinal tombstone 防旧 replay 复活。 */
    abort(topic: string, subscriptionId: string): void;
    clear(): void;
    getStats(): {
        assemblies: number;
        stagedDecodedBytes: number;
    };
    get nextExpiryAt(): number | null;
    private release;
    private settle;
    private releaseAndSettle;
    private fault;
}
//# sourceMappingURL=wire-assembler.d.ts.map