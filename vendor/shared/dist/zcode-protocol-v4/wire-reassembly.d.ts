import { z } from "zod";
import type { TopicFrameDeliveryKind, TopicWireFrame } from "./wire.js";
export type ReassembleTopicWireFramesResult<F> = {
    kind: "complete";
    frame: F;
    deliveryKind: TopicFrameDeliveryKind;
} | {
    kind: "incomplete";
    logicalFrameId: string;
    missingIndexes: number[];
} | {
    kind: "rejected";
    reasonCode: string;
};
export declare function reassembleTopicWireFrames<F>(wires: readonly TopicWireFrame<unknown>[], frameSchema: z.ZodType<F>, options?: {
    maxAssemblyBytes?: number;
}): ReassembleTopicWireFramesResult<F>;
//# sourceMappingURL=wire-reassembly.d.ts.map