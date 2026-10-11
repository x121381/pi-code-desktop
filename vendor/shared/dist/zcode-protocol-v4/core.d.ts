import { z } from "zod";
/** V4 物理 wire 协议版本；projection snapshot 继续独立使用 protocolVersion=1。 */
export declare const V4_WIRE_PROTOCOL_VERSION: 3;
/** V3 row target：display row 与稳定实体必须成对提交并由同一权威投影校验。 */
export declare const conversationRowTargetSchema: z.ZodObject<{
    rowId: z.ZodNumber;
    entityId: z.ZodString;
}, z.core.$strict>;
export type ConversationRowTarget = z.infer<typeof conversationRowTargetSchema>;
export declare const timestampSchema: z.ZodNumber;
export type Timestamp = z.infer<typeof timestampSchema>;
export declare const streamablePathSchema: z.ZodEnum<{
    text: "text";
    inputText: "inputText";
    "output.text": "output.text";
    summaryText: "summaryText";
}>;
export type StreamablePath = z.infer<typeof streamablePathSchema>;
export interface DeliveryProfile {
    desktopOnlyRows: boolean;
    flushWindowMs: number;
    streamPaths: Record<StreamablePath, boolean>;
    streamOutputCapBytes: number;
    toolProgress: boolean;
}
export declare const DELIVERY_PROFILES: {
    readonly continuous: {
        readonly desktopOnlyRows: true;
        readonly flushWindowMs: 30;
        readonly streamPaths: {
            readonly text: true;
            readonly inputText: true;
            readonly "output.text": true;
            readonly summaryText: true;
        };
        readonly streamOutputCapBytes: 262144;
        readonly toolProgress: false;
    };
    readonly replayable: {
        readonly desktopOnlyRows: false;
        readonly flushWindowMs: 150;
        readonly streamPaths: {
            readonly text: true;
            readonly inputText: false;
            readonly "output.text": false;
            readonly summaryText: false;
        };
        readonly streamOutputCapBytes: 0;
        readonly toolProgress: true;
    };
};
export type DeliveryProfileName = keyof typeof DELIVERY_PROFILES;
export declare const PROTOCOL_V4_LIMITS: {
    readonly maxFrameBytes: number;
    readonly logicalFrameAssemblyMaxBytes: number;
    readonly logicalFrameAssemblyMaxFragments: 1024;
    readonly logicalFrameAssemblyMaxConcurrent: 32;
    readonly logicalFrameAssemblyMaxStagedBytes: number;
    readonly logicalFrameAssemblyTimeoutMs: 30000;
    readonly transportEnvelopeIdMaxChars: 256;
    readonly subscriberBufferMaxOps: 500;
    readonly subscriberBufferMaxBytes: number;
    readonly eventRetentionPerSession: 2000;
    readonly snapshotTailWindowRows: 60;
    readonly rowsRangeMaxLimit: 200;
    readonly toolOutputFinalHeadBytes: number;
    readonly toolOutputFinalTailBytes: number;
    readonly goalVerificationsRetained: 20;
    readonly pendingCommandsDisplayMax: 32;
    readonly commandPendingTtlMs: number;
    readonly idempotencyTablePerSession: 512;
    readonly conversationQueryTimeoutMs: 10000;
    readonly attachmentMaxBytes: number;
    readonly attachmentChunkMaxBytes: number;
    readonly attachmentPreviewMaxBytes: number;
    readonly attachmentStatMaxBytes: number;
    readonly attachmentPreviewMaxChunks: number;
    readonly attachmentReadCacheMaxBytes: number;
    readonly attachmentReadCacheTtlMs: 30000;
    readonly attachmentUploadMaxChunks: 64;
    readonly attachmentUploadMaxConcurrent: 16;
    readonly attachmentUploadMaxStagedBytes: number;
    readonly attachmentUploadTtlMs: number;
    readonly attachmentUnreferencedTtlMs: number;
};
//# sourceMappingURL=core.d.ts.map