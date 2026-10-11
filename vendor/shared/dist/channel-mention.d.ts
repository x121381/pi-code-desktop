import { z } from "zod";
export declare const channelMentionSchema: z.ZodObject<{
    type: z.ZodLiteral<"channelMention">;
    refId: z.ZodString;
    name: z.ZodString;
    channel: z.ZodEnum<{
        feishu: "feishu";
        lark: "lark";
    }>;
    targetId: z.ZodString;
    idType: z.ZodLiteral<"open_id">;
    entityType: z.ZodEnum<{
        unknown: "unknown";
        user: "user";
        bot: "bot";
    }>;
}, z.core.$strict>;
export declare const channelContentPartSchema: z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"channelMention">;
    refId: z.ZodString;
    name: z.ZodString;
    channel: z.ZodEnum<{
        feishu: "feishu";
        lark: "lark";
    }>;
    targetId: z.ZodString;
    idType: z.ZodLiteral<"open_id">;
    entityType: z.ZodEnum<{
        unknown: "unknown";
        user: "user";
        bot: "bot";
    }>;
}, z.core.$strict>]>;
export declare const channelContentPartsSchema: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"channelMention">;
    refId: z.ZodString;
    name: z.ZodString;
    channel: z.ZodEnum<{
        feishu: "feishu";
        lark: "lark";
    }>;
    targetId: z.ZodString;
    idType: z.ZodLiteral<"open_id">;
    entityType: z.ZodEnum<{
        unknown: "unknown";
        user: "user";
        bot: "bot";
    }>;
}, z.core.$strict>]>>;
export type ChannelContentPart = z.infer<typeof channelContentPartSchema>;
export declare const channelReplyPartsSchema: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"mention">;
    refId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"mentionName">;
    name: z.ZodString;
    candidateRef: z.ZodOptional<z.ZodString>;
}, z.core.$strict>]>>;
export declare const channelReplyRequestSchema: z.ZodObject<{
    taskId: z.ZodString;
    inputId: z.ZodString;
    authorizationId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodString;
    parts: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"mention">;
        refId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"mentionName">;
        name: z.ZodString;
        candidateRef: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>]>>;
}, z.core.$strict>;
export declare const channelMentionClarificationSchema: z.ZodObject<{
    status: z.ZodLiteral<"needs_clarification">;
    unresolved: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        reason: z.ZodEnum<{
            unavailable: "unavailable";
            ambiguous: "ambiguous";
            not_found: "not_found";
            selection_expired: "selection_expired";
        }>;
        candidates: z.ZodArray<z.ZodObject<{
            ref: z.ZodString;
            name: z.ZodString;
            label: z.ZodString;
            kind: z.ZodEnum<{
                unknown: "unknown";
                user: "user";
                bot: "bot";
            }>;
        }, z.core.$strict>>;
        truncated: z.ZodBoolean;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const channelReplyResultSchema: z.ZodUnion<readonly [z.ZodObject<{
    status: z.ZodEnum<{
        failed: "failed";
        unknown: "unknown";
        sent: "sent";
        invalidated: "invalidated";
    }>;
    deliveryId: z.ZodString;
    providerMessageId: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    status: z.ZodLiteral<"needs_clarification">;
    unresolved: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        reason: z.ZodEnum<{
            unavailable: "unavailable";
            ambiguous: "ambiguous";
            not_found: "not_found";
            selection_expired: "selection_expired";
        }>;
        candidates: z.ZodArray<z.ZodObject<{
            ref: z.ZodString;
            name: z.ZodString;
            label: z.ZodString;
            kind: z.ZodEnum<{
                unknown: "unknown";
                user: "user";
                bot: "bot";
            }>;
        }, z.core.$strict>>;
        truncated: z.ZodBoolean;
    }, z.core.$strict>>;
}, z.core.$strict>]>;
export type ChannelReplyRequest = z.infer<typeof channelReplyRequestSchema>;
export type ChannelReplyResult = z.infer<typeof channelReplyResultSchema>;
export declare function channelContentText(parts: readonly ChannelContentPart[]): string;
/** 只从 Host 已验证的会话输入解析 ref；模型不得直接提供平台 ID。 */
export declare function resolveChannelReplyParts(parts: z.infer<typeof channelReplyPartsSchema>, source: readonly ChannelContentPart[]): ChannelContentPart[];
export declare const channelReplyHostRequestSchema: z.ZodObject<{
    taskId: z.ZodString;
    inputId: z.ZodString;
    authorizationId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodString;
    parts: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"mention">;
        refId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"mentionName">;
        name: z.ZodString;
        candidateRef: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>]>>;
    trace: z.ZodOptional<z.ZodObject<{
        traceId: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
        spanId: z.ZodOptional<z.ZodString>;
        traceparent: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ChannelReplyHostRequest = z.infer<typeof channelReplyHostRequestSchema>;
//# sourceMappingURL=channel-mention.d.ts.map