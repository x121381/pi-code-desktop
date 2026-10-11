import { z } from "zod";
import { V4_WIRE_PROTOCOL_VERSION } from "./core.js";
export declare const topicWireChecksumSchema: z.ZodObject<{
    algorithm: z.ZodLiteral<"crc32">;
    value: z.ZodString;
}, z.core.$strict>;
export type TopicWireChecksum = z.infer<typeof topicWireChecksumSchema>;
/** publisher reservation 对物理帧用途的权威标记；consumer 禁止按 RPC 时序猜测。 */
export declare const topicFrameDeliveryKindSchema: z.ZodEnum<{
    recovery: "recovery";
    initial: "initial";
    online: "online";
}>;
export type TopicFrameDeliveryKind = z.infer<typeof topicFrameDeliveryKindSchema>;
export type TopicWireFrame<F> = {
    wireVersion: typeof V4_WIRE_PROTOCOL_VERSION;
    kind: "complete";
    deliveryKind: TopicFrameDeliveryKind;
    logicalFrameId: string;
    logicalFrameOrdinal: number;
    topic: string;
    subscriptionId: string;
    frame: F;
} | {
    wireVersion: typeof V4_WIRE_PROTOCOL_VERSION;
    kind: "fragment";
    deliveryKind: TopicFrameDeliveryKind;
    logicalFrameId: string;
    logicalFrameOrdinal: number;
    topic: string;
    subscriptionId: string;
    fragmentIndex: number;
    fragmentCount: number;
    logicalBytes: number;
    checksum: TopicWireChecksum;
    dataBase64: string;
};
/**
 * service 边界只验证可安全路由/计量的 outer 形状；range/base64/checksum/logical
 * payload 的完整校验必须在 ownership 过滤后的 assembler 中产生 typed fault。
 */
export declare const topicWireFrameCandidateSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    wireVersion: z.ZodLiteral<3>;
    kind: z.ZodLiteral<"complete">;
    deliveryKind: z.ZodOptional<z.ZodUnknown>;
    logicalFrameId: z.ZodString;
    logicalFrameOrdinal: z.ZodNumber;
    topic: z.ZodString;
    subscriptionId: z.ZodString;
    frame: z.ZodOptional<z.ZodUnknown>;
}, z.core.$loose>, z.ZodObject<{
    wireVersion: z.ZodLiteral<3>;
    kind: z.ZodLiteral<"fragment">;
    deliveryKind: z.ZodOptional<z.ZodUnknown>;
    logicalFrameId: z.ZodString;
    logicalFrameOrdinal: z.ZodNumber;
    topic: z.ZodString;
    subscriptionId: z.ZodString;
    fragmentIndex: z.ZodOptional<z.ZodUnknown>;
    fragmentCount: z.ZodOptional<z.ZodUnknown>;
    logicalBytes: z.ZodOptional<z.ZodUnknown>;
    checksum: z.ZodOptional<z.ZodUnknown>;
    dataBase64: z.ZodOptional<z.ZodUnknown>;
}, z.core.$loose>], "kind">;
export type TopicWireFrameCandidate = z.infer<typeof topicWireFrameCandidateSchema>;
export declare function createTopicWireFrameSchema<F extends z.ZodTypeAny>(frameSchema: F): z.ZodDiscriminatedUnion<[z.ZodObject<{
    wireVersion: z.ZodLiteral<3>;
    kind: z.ZodLiteral<"complete">;
    deliveryKind: z.ZodEnum<{
        recovery: "recovery";
        initial: "initial";
        online: "online";
    }>;
    logicalFrameId: z.ZodString;
    logicalFrameOrdinal: z.ZodNumber;
    topic: z.ZodString;
    subscriptionId: z.ZodString;
    frame: F;
}, z.core.$strict>, z.ZodObject<{
    wireVersion: z.ZodLiteral<3>;
    kind: z.ZodLiteral<"fragment">;
    deliveryKind: z.ZodEnum<{
        recovery: "recovery";
        initial: "initial";
        online: "online";
    }>;
    logicalFrameId: z.ZodString;
    logicalFrameOrdinal: z.ZodNumber;
    topic: z.ZodString;
    subscriptionId: z.ZodString;
    fragmentIndex: z.ZodNumber;
    fragmentCount: z.ZodNumber;
    logicalBytes: z.ZodNumber;
    checksum: z.ZodObject<{
        algorithm: z.ZodLiteral<"crc32">;
        value: z.ZodString;
    }, z.core.$strict>;
    dataBase64: z.ZodString;
}, z.core.$strict>], "kind">;
//# sourceMappingURL=wire.d.ts.map