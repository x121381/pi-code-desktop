import { type ZCodeProtocolTrace } from "./zcode-protocol/trace.js";
import { type ChannelContentPart } from "./channel-mention.js";
import { z } from "zod";
import { type ModelSelection } from "./model-selection.js";
import type { ZCodeConfigOption, ZCodeElicitationRequest, ZCodeElicitationQuestion, ZCodePermissionRequest, ZCodePromptAttachment, ZCodeProvider, ZCodeStreamEvent, ZCodeTaskMeta, ZCodeTaskRuntimeStatus } from "./zcode-task-types-core.js";
import { type ZCodeInteractionRequestOrigin, type ZCodePermissionResponse } from "./zcode-protocol-legacy-types.js";
import type { Locale } from "./protocol.js";
export declare const botProviders: readonly ["telegram", "webhook", "feishu", "lark", "weixin", "discord", "wecom"];
export type BotProvider = (typeof botProviders)[number];
export type FeishuBotProvider = Extract<BotProvider, "feishu" | "lark">;
/**
 * 定时任务完成后的 Bot 回推目标。只保留未来仍稳定的会话地址；当前消息 id/context token
 * 属于一次入站交互，不能持久化后复用。该字段由 Host 注入，模型工具参数不直接暴露。
 */
export declare const zcodeAutomationBotDeliveryTargetSchema: z.ZodObject<{
    provider: z.ZodEnum<{
        feishu: "feishu";
        lark: "lark";
        weixin: "weixin";
    }>;
    botId: z.ZodString;
    providerUserId: z.ZodString;
    chatType: z.ZodEnum<{
        private: "private";
        group: "group";
    }>;
    threadId: z.ZodOptional<z.ZodString>;
    rootMessageId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeAutomationBotDeliveryTarget = z.infer<typeof zcodeAutomationBotDeliveryTargetSchema>;
export declare function isFeishuBotProvider(provider: BotProvider): provider is FeishuBotProvider;
export type BotContextMode = "draft" | "task";
export type BotReplyGranularity = "assistant_changes" | "assistant_toolcalls_changes" | "summary_changes" | "streaming_card";
export declare const BOT_REPLY_GRANULARITIES: readonly ["assistant_changes", "assistant_toolcalls_changes", "summary_changes", "streaming_card"];
export declare const ALL_BOT_WORKSPACES = "*";
export declare const BOT_BIND_CODE_TTL_MS = 30000;
export interface BotWorkspaceRef {
    id: string;
    label: string;
    workspacePath: string;
    workspaceIdentity?: string;
}
export interface BotAllowedCommands {
    status: boolean;
    new: boolean;
    workspace: boolean;
    model: boolean;
    mode?: boolean;
    thoughtLevel: boolean;
    sandboxMode?: boolean;
    approvalPolicy?: boolean;
    reply: boolean;
}
export type BotCommandPolicy = BotAllowedCommands;
export interface BotCurrentOptions {
    modelSelection?: ModelSelection;
    mode?: string;
    sandboxMode?: string;
    approvalPolicy?: string;
}
export type BotReplyMode = BotReplyGranularity;
export interface BotConfig {
    id: string;
    name: string;
    provider: BotProvider;
    enabled: boolean;
    credentialRef?: string;
    webhookSecretRef?: string;
    webhookUrl?: string;
    webhookAuthHeaderName?: string;
    feishuAppId?: string;
    providerUserId?: string;
    displayName?: string;
    allowedWorkspaces: string[];
    allowedCommands: BotAllowedCommands;
    currentOptions: BotCurrentOptions;
    replyMode: BotReplyMode;
}
export interface BotPendingPermissionOption {
    requestId: string;
    optionId: string;
    command: "approve" | "deny";
    label: string;
    response: ZCodePermissionResponse;
    handledAt?: number;
}
export interface BotPendingElicitation {
    taskId: string;
    requestId: string;
    runId: string;
    origin?: ZCodeInteractionRequestOrigin;
    actorKey?: string;
    currentQuestionIndex: number;
    questions: ZCodeElicitationQuestion[];
    answers: Record<string, string[]>;
    renderContext?: {
        kind: "plan_approval";
        plan: string;
    };
    expandedCustomAnswerQuestionIndexes?: number[];
    handledAt?: number;
}
export interface BotStructuredElicitationResponse {
    requestId: string;
    action: "accept" | "decline" | "cancel";
    content?: Record<string, unknown>;
}
export interface BotOutboundElicitationRequest {
    requestId: string;
    taskId: string;
    runId: string;
    currentQuestionIndex: number;
    questions: ZCodeElicitationQuestion[];
    answers?: Record<string, string[]>;
    status?: "pending" | "completed" | "cancelled";
    expandedCustomAnswerQuestionIndexes?: number[];
    schema?: unknown;
}
export interface BotDraftOptions {
    provider: ZCodeProvider;
    modelSelection?: ModelSelection;
    mode?: string;
}
export interface BotsConfigFile {
    version: 3;
    bots: BotConfig[];
}
export interface BotState {
    botId: string;
    group?: BotGroupSession;
    workspacePath: string;
    workspaceIdentity?: string;
    workspaceId?: string;
    mode: BotContextMode;
    activeTaskId: string | null;
    draftOptions?: BotDraftOptions;
    pendingPermissionOptions?: BotPendingPermissionOption[];
    pendingElicitation?: BotPendingElicitation;
    telegramOffset?: number;
    weixinGetUpdatesBuf?: string;
    weixinActivatedAt?: number;
    /** 单聊绑定代际，阻止换绑后迟到事件恢复旧关联。 */
    privateBindingId?: string;
    /** iLink 登录返回机器人身份，单聊接收人来自已授权入站消息。 */
    privateRecipientId?: string;
    updatedAt: number;
}
export type BotContextState = BotState;
export declare const botGroupDeliverySchema: z.ZodObject<{
    channelReplyRequestHash: z.ZodOptional<z.ZodString>;
    appId: z.ZodOptional<z.ZodString>;
    trace: z.ZodOptional<z.ZodObject<{
        traceId: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
        spanId: z.ZodOptional<z.ZodString>;
        traceparent: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    authorizationId: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    taskId: z.ZodString;
    sourceCommandId: z.ZodOptional<z.ZodString>;
    text: z.ZodString;
    replyToMessageId: z.ZodOptional<z.ZodString>;
    mentionedUserIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
    }, z.core.$strict>]>>>;
    providerMessageId: z.ZodOptional<z.ZodString>;
    threadId: z.ZodOptional<z.ZodString>;
    rootMessageId: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        pending: "pending";
        failed: "failed";
        unknown: "unknown";
        sent: "sent";
        invalidated: "invalidated";
    }>;
    lastError: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodNumber;
}, z.core.$strict>;
export type BotGroupDelivery = z.infer<typeof botGroupDeliverySchema>;
export declare const botGroupCardSchema: z.ZodObject<{
    chatId: z.ZodString;
    threadId: z.ZodOptional<z.ZodString>;
    conversationThreadId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    taskId: z.ZodNullable<z.ZodString>;
    authorizationId: z.ZodString;
}, z.core.$strict>;
export type BotGroupCard = z.infer<typeof botGroupCardSchema>;
export declare const botTopicMessageSchema: z.ZodObject<{
    id: z.ZodString;
    chatId: z.ZodString;
    threadId: z.ZodString;
    senderId: z.ZodString;
    senderName: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodString>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        kind: z.ZodString;
    }, z.core.$strict>>>;
    senderType: z.ZodEnum<{
        app: "app";
        user: "user";
    }>;
    text: z.ZodString;
    createdAt: z.ZodNumber;
    kind: z.ZodString;
    controlCard: z.ZodOptional<z.ZodBoolean>;
    deleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type BotTopicMessage = z.infer<typeof botTopicMessageSchema>;
export interface BotTopicHistoryRequest {
    chatId: string;
    threadId: string;
    rootMessageId: string;
    messageId: string;
    checkpoint?: string;
}
export declare const botTopicContextSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        chatId: z.ZodString;
        threadId: z.ZodString;
        senderId: z.ZodString;
        senderName: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
        attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodString;
        }, z.core.$strict>>>;
        senderType: z.ZodEnum<{
            app: "app";
            user: "user";
        }>;
        text: z.ZodString;
        createdAt: z.ZodNumber;
        kind: z.ZodString;
        controlCard: z.ZodOptional<z.ZodBoolean>;
        deleted: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    checkpoint: z.ZodString;
    hasGap: z.ZodBoolean;
}, z.core.$strict>;
export type BotTopicHistoryBatch = z.infer<typeof botTopicContextSchema>;
export declare const botIdentitySchema: z.ZodObject<{
    name: z.ZodString;
    openId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const botBackgroundHistorySchema: z.ZodObject<{
    revision: z.ZodString;
    checkpoint: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const botAutoReplyGuardSchema: z.ZodObject<{
    consecutive: z.ZodNumber;
    messageIds: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export interface BotGroupSession {
    preparation?: BotTopicPreparation[];
    chatId: string;
    chatMode?: "group" | "topic";
    threadId?: string;
    rootMessageId?: string;
    topicTitle?: string;
    topicUrl?: string;
    /** 仅群默认记录拥有此配置；话题按群授权检查读取。 */
    historyEnabled?: boolean;
    /** 仅成功接收首次输入后接入；leave 后保留任务但停止普通消息触发。 */
    topicActive?: boolean;
    topicAliases?: Record<string, {
        taskId: string;
        rootMessageId: string;
    }>;
    name: string;
    ownerId: string;
    enabled: boolean;
    taskIds: string[];
    taskWorkspaces?: Record<string, {
        workspacePath: string;
        workspaceIdentity?: string;
    }>;
    currentOptions: BotCurrentOptions;
    initiatorId?: string;
    authorizationId?: string;
    deliveries?: Record<string, BotGroupDelivery>;
    autoReplyGuard?: z.infer<typeof botAutoReplyGuardSchema>;
    backgroundHistory?: z.infer<typeof botBackgroundHistorySchema>;
    inputs?: Record<string, {
        taskId: string;
        source: BotGroupInputSource;
        admission?: "pending" | "accepted" | "rejected";
        progress?: BotGroupInputProgress;
    }>;
}
export declare const botGroupInputStatusSchema: z.ZodEnum<{
    failed: "failed";
    done: "done";
    cancelled: "cancelled";
    stopped: "stopped";
    waiting: "waiting";
    discarded: "discarded";
    working: "working";
}>;
export type BotGroupInputStatus = z.infer<typeof botGroupInputStatusSchema>;
export declare const botTopicPreparationSchema: z.ZodObject<{
    contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
    }, z.core.$strict>]>>>;
    messageId: z.ZodString;
    senderName: z.ZodString;
    text: z.ZodString;
    status: z.ZodEnum<{
        failed: "failed";
        preparing: "preparing";
        waitingStop: "waitingStop";
    }>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type BotTopicPreparation = z.infer<typeof botTopicPreparationSchema>;
export declare const botGroupInputProgressSchema: z.ZodObject<{
    status: z.ZodEnum<{
        failed: "failed";
        done: "done";
        cancelled: "cancelled";
        stopped: "stopped";
        waiting: "waiting";
        discarded: "discarded";
        working: "working";
    }>;
    interruptionReason: z.ZodOptional<z.ZodLiteral<"newMessage">>;
    cardMessageId: z.ZodOptional<z.ZodString>;
    cardStatus: z.ZodOptional<z.ZodEnum<{
        failed: "failed";
        done: "done";
        cancelled: "cancelled";
        stopped: "stopped";
        waiting: "waiting";
        discarded: "discarded";
        working: "working";
    }>>;
}, z.core.$strict>;
export type BotGroupInputProgress = z.infer<typeof botGroupInputProgressSchema>;
/** CLI 只接收轻量材料索引；原文留在 Host 归档及文本附件。 */
export declare const botTopicHistorySourceSchema: z.ZodObject<{
    checkpoint: z.ZodString;
    hasGap: z.ZodBoolean;
    messageCount: z.ZodNumber;
    resourceMessages: z.ZodArray<z.ZodObject<{
        messageId: z.ZodString;
        count: z.ZodNumber;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const botTopicInputMessageSchema: z.ZodObject<{
    contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
    }, z.core.$strict>]>>>;
    messageId: z.ZodString;
    senderId: z.ZodString;
    senderName: z.ZodString;
    mentionedBot: z.ZodOptional<z.ZodBoolean>;
    text: z.ZodString;
    conversationQuotes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        senderName: z.ZodOptional<z.ZodString>;
        senderId: z.ZodOptional<z.ZodString>;
        messageId: z.ZodOptional<z.ZodString>;
        sentAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    attachmentIndexes: z.ZodArray<z.ZodNumber>;
}, z.core.$strict>;
/** 可信 Host 注入的输入来源；身份展示不能反向授予执行权限。 */
export declare const botGroupInputSourceSchema: z.ZodObject<{
    botIdentity: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        openId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    appId: z.ZodOptional<z.ZodString>;
    contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
    }, z.core.$strict>]>>>;
    authorizationId: z.ZodOptional<z.ZodString>;
    botId: z.ZodString;
    provider: z.ZodEnum<{
        feishu: "feishu";
        lark: "lark";
    }>;
    chatId: z.ZodString;
    threadId: z.ZodOptional<z.ZodString>;
    rootMessageId: z.ZodOptional<z.ZodString>;
    senderId: z.ZodString;
    senderName: z.ZodString;
    mentionedBot: z.ZodOptional<z.ZodBoolean>;
    messageId: z.ZodString;
    messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
        }, z.core.$strict>]>>>;
        messageId: z.ZodString;
        senderId: z.ZodString;
        senderName: z.ZodString;
        mentionedBot: z.ZodOptional<z.ZodBoolean>;
        text: z.ZodString;
        conversationQuotes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            path: z.ZodOptional<z.ZodString>;
            senderName: z.ZodOptional<z.ZodString>;
            senderId: z.ZodOptional<z.ZodString>;
            messageId: z.ZodOptional<z.ZodString>;
            sentAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        attachmentIndexes: z.ZodArray<z.ZodNumber>;
    }, z.core.$strict>>>;
    topicContext: z.ZodOptional<z.ZodObject<{
        messages: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            chatId: z.ZodString;
            threadId: z.ZodString;
            senderId: z.ZodString;
            senderName: z.ZodOptional<z.ZodString>;
            parentId: z.ZodOptional<z.ZodString>;
            attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                kind: z.ZodString;
            }, z.core.$strict>>>;
            senderType: z.ZodEnum<{
                app: "app";
                user: "user";
            }>;
            text: z.ZodString;
            createdAt: z.ZodNumber;
            kind: z.ZodString;
            controlCard: z.ZodOptional<z.ZodBoolean>;
            deleted: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        checkpoint: z.ZodString;
        hasGap: z.ZodBoolean;
    }, z.core.$strict>>;
    topicHistory: z.ZodOptional<z.ZodObject<{
        checkpoint: z.ZodString;
        hasGap: z.ZodBoolean;
        messageCount: z.ZodNumber;
        resourceMessages: z.ZodArray<z.ZodObject<{
            messageId: z.ZodString;
            count: z.ZodNumber;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type BotGroupInputSource = z.infer<typeof botGroupInputSourceSchema>;
export interface BotsStateFile {
    version: 3;
    bots: Record<string, BotState>;
}
export interface BotRuntimeInfo {
    /** 最近一次消息投递错误；独立于长连接状态，成功投递后清除。 */
    deliveryError?: string;
    /** 当前进程保留的失败单聊回复；显式重试可能重复此前已收到的内容。 */
    deliveryRetryId?: string;
    botId: string;
    provider: BotProvider;
    status: "disabled" | "idle" | "polling" | "connected" | "error";
    messageId?: string;
    message?: string;
    lastUpdateAt?: number;
    offset?: number;
}
export interface BotActor {
    /** 本次可信输入是否明确提及机器人；用于话题回复提醒。 */
    mentionedBot?: boolean;
    provider: BotProvider;
    botId: string;
    providerUserId: string;
    displayName?: string;
    chatType: "private" | "group";
    chatId?: string;
    threadId?: string;
    /** 仅服务根据已保存的结果关联设置；null 表示原群默认任务。 */
    conversationThreadId?: string | null;
    rootMessageId?: string;
    topicTitle?: string;
    topicUrl?: string;
    providerMessageId?: string;
    providerContextToken?: string;
}
export type BotInboundAttachmentKind = "image" | "audio" | "video" | "file";
export interface BotInboundAttachment {
    id: string;
    kind: BotInboundAttachmentKind;
    filename: string;
    mimeType: string;
    sizeBytes?: number;
    providerFileId?: string;
    downloadUrl?: string;
    dataBase64?: string;
    localPath?: string;
    providerMetadata?: Record<string, string>;
}
export type BotCommand = {
    type: "group.history";
    enabled?: boolean;
} | {
    type: "queue.cancel";
    commandId: string;
} | {
    type: "group.enable";
} | {
    type: "group.disable";
} | {
    type: "bind";
    code: string;
} | {
    type: "help";
} | {
    type: "status";
} | {
    type: "new";
} | {
    type: "reconnect";
} | {
    type: "workspace.list";
} | {
    type: "workspace.set";
    value: string;
} | {
    type: "model.list";
} | {
    type: "model.provider.set";
    value: string;
} | {
    type: "model.set";
    value: string;
} | {
    type: "mode.list";
} | {
    type: "mode.set";
    value: string;
} | {
    type: "thoughtLevel.list";
} | {
    type: "thoughtLevel.set";
    value: string;
} | {
    type: "task.list";
} | {
    type: "task.set";
    value: string;
} | {
    type: "reply.list";
} | {
    type: "reply.set";
    value: string;
} | {
    type: "stop";
} | {
    type: "topic.leave";
} | {
    type: "permission.respond";
    value: string;
} | {
    type: "elicitation.respond";
    value: string;
} | {
    type: "elicitation.submit";
} | {
    type: "approve";
    requestId: string;
    optionId: string;
} | {
    type: "deny";
    requestId: string;
} | {
    type: "unknown";
    name: string;
    raw: string;
} | {
    type: "selection.cancel";
} | {
    type: "message";
    text: string;
};
export interface SelectionPrompt {
    id: string;
    token?: string;
    title: string;
    currentId?: string;
    cancelLabel?: string;
    showCancel?: boolean;
    action: "queue.cancel" | "workspace.set" | "model.provider.set" | "model.set" | "mode.set" | "thoughtLevel.set" | "task.set" | "reply.set" | "permission.respond" | "elicitation.respond";
    options: Array<{
        id: string;
        label: string;
        description?: string;
    }>;
}
export interface BotInboundMessage {
    /** 仅供命令/纯唤醒识别；原文 text 和 contentParts 保持完整。 */
    commandText?: string;
    /** Provider 核验的当前机器人身份，不从正文推断。 */
    botOpenId?: string;
    /** Provider 校验的发送者类型；机器人正文不具有控制命令权限。 */
    senderType?: "user" | "app";
    contentParts?: ChannelContentPart[];
    /** 由 Provider 根据真实 mention 身份设置；不是正文解析结果。 */
    mentionedBot?: boolean;
    /** 原生根消息经 Provider 核验确为当前机器人发送。 */
    topicRootIsCurrentBot?: boolean;
    /** 可信 Provider 校验后的明确引用，不参与控制命令解析。 */
    referencedMessage?: import("./conversationSelection.js").ConversationSelectionText & {
        messageId: string;
    };
    groupCard?: BotGroupCard;
    groupCardAction?: boolean;
    botId: string;
    actor: BotActor;
    text: string;
    attachments?: BotInboundAttachment[];
    elicitationResponse?: BotStructuredElicitationResponse;
    receivedAt?: number;
}
export interface BotOutboundMessage {
    trace?: ZCodeProtocolTrace;
    contentParts?: ChannelContentPart[];
    groupCard?: BotGroupCard;
    threadId?: string;
    conversationThreadId?: string | null;
    rootMessageId?: string;
    botId: string;
    provider: BotProvider;
    providerUserId: string;
    text: string;
    locale?: Locale;
    selection?: SelectionPrompt;
    elicitation?: BotOutboundElicitationRequest;
    providerContextToken?: string;
    /** 无权限/过期回调只能提示操作者，不能覆盖群共享卡片。 */
    callbackToastOnly?: boolean;
    /** 管理员待办独立通知，不允许用拒绝提示覆盖共享卡片。 */
    administratorAttention?: boolean;
    replyToMessageId?: string;
    /** 可信输入决定的提醒对象；只作展示，不授予群操作权限。 */
    mentionedUserIds?: string[];
    deliveryId?: string;
    /** 任务回推需在实际发送前重新验证群当前关联。控制命令回复不携带。 */
    groupTaskId?: string;
    /** 可信任务事件中的输入命令，用于将投递状态定位到对应回复。 */
    groupSourceCommandId?: string;
}
export interface BotTaskSummary {
    taskId: string;
    title: string;
    status: ZCodeTaskRuntimeStatus | "persisted-completed" | "persisted-error" | "unknown";
    workspacePath: string;
    workspaceIdentity?: string;
    provider?: ZCodeProvider;
    model?: string;
}
export declare const BOT_TASK_BROADCAST_CHANNEL = "bots:task";
export declare const BOT_TASK_STREAM_BROADCAST_CHANNEL = "bots:task-stream";
export type BotTaskBroadcastEvent = "created" | "prompt_sent" | "resumed" | "streaming" | "permission_request" | "permission_resolved" | "elicitation_request" | "elicitation_resolved" | "updated" | "completed" | "error";
export interface BotTaskBroadcastPayload {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string;
    event: BotTaskBroadcastEvent;
    updatedAt: number;
    task?: ZCodeTaskMeta;
    provider?: ZCodeProvider;
    configOptions?: ZCodeConfigOption[];
    prompt?: {
        content: string;
        attachments?: ZCodePromptAttachment[];
        messageId: string;
        sentAt: number;
    };
    permissionRequest?: ZCodePermissionRequest;
    elicitationRequest?: ZCodeElicitationRequest;
    requestId?: string;
    error?: string;
}
export interface BotTaskStreamBroadcastPayload {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string;
    event: ZCodeStreamEvent;
    updatedAt: number;
}
export interface BotServiceStatus {
    botsCount: number;
    enabledBotsCount: number;
    contextsCount: number;
    botRuntime: BotRuntimeInfo[];
}
export interface BotProviderCallbackResult {
    ok: boolean;
    replies: BotOutboundMessage[];
    responseBody?: unknown;
    status?: number;
}
export declare const botAllowedCommandsSchema: z.ZodObject<{
    status: z.ZodBoolean;
    new: z.ZodBoolean;
    workspace: z.ZodBoolean;
    model: z.ZodBoolean;
    mode: z.ZodOptional<z.ZodBoolean>;
    thoughtLevel: z.ZodBoolean;
    sandboxMode: z.ZodOptional<z.ZodBoolean>;
    approvalPolicy: z.ZodOptional<z.ZodBoolean>;
    cli: z.ZodOptional<z.ZodBoolean>;
    reply: z.ZodBoolean;
}, z.core.$strict>;
export declare const botCommandPolicySchema: z.ZodObject<{
    status: z.ZodBoolean;
    new: z.ZodBoolean;
    workspace: z.ZodBoolean;
    model: z.ZodBoolean;
    mode: z.ZodOptional<z.ZodBoolean>;
    thoughtLevel: z.ZodBoolean;
    sandboxMode: z.ZodOptional<z.ZodBoolean>;
    approvalPolicy: z.ZodOptional<z.ZodBoolean>;
    cli: z.ZodOptional<z.ZodBoolean>;
    reply: z.ZodBoolean;
}, z.core.$strict>;
export declare const botCurrentOptionsSchema: z.ZodObject<{
    modelSelection: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    mode: z.ZodOptional<z.ZodString>;
    sandboxMode: z.ZodOptional<z.ZodString>;
    approvalPolicy: z.ZodOptional<z.ZodString>;
    cli: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        claude: "claude";
        glm: "glm";
        opencode: "opencode";
        gemini: "gemini";
        codex: "codex";
    }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>>;
}, z.core.$strict>;
export declare const botDraftOptionsSchema: z.ZodObject<{
    provider: z.ZodPipe<z.ZodEnum<{
        claude: "claude";
        glm: "glm";
        opencode: "opencode";
        gemini: "gemini";
        codex: "codex";
    }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>;
    modelSelection: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    mode: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const botConfigSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    provider: z.ZodEnum<{
        feishu: "feishu";
        lark: "lark";
        telegram: "telegram";
        webhook: "webhook";
        weixin: "weixin";
        discord: "discord";
        wecom: "wecom";
    }>;
    enabled: z.ZodBoolean;
    credentialRef: z.ZodOptional<z.ZodString>;
    webhookSecretRef: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
    webhookAuthHeaderName: z.ZodOptional<z.ZodString>;
    feishuAppId: z.ZodOptional<z.ZodString>;
    providerUserId: z.ZodOptional<z.ZodString>;
    displayName: z.ZodOptional<z.ZodString>;
    allowedWorkspaces: z.ZodArray<z.ZodString>;
    allowedCommands: z.ZodObject<{
        status: z.ZodBoolean;
        new: z.ZodBoolean;
        workspace: z.ZodBoolean;
        model: z.ZodBoolean;
        mode: z.ZodOptional<z.ZodBoolean>;
        thoughtLevel: z.ZodBoolean;
        sandboxMode: z.ZodOptional<z.ZodBoolean>;
        approvalPolicy: z.ZodOptional<z.ZodBoolean>;
        cli: z.ZodOptional<z.ZodBoolean>;
        reply: z.ZodBoolean;
    }, z.core.$strict>;
    currentOptions: z.ZodObject<{
        modelSelection: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        mode: z.ZodOptional<z.ZodString>;
        sandboxMode: z.ZodOptional<z.ZodString>;
        approvalPolicy: z.ZodOptional<z.ZodString>;
        cli: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
            claude: "claude";
            glm: "glm";
            opencode: "opencode";
            gemini: "gemini";
            codex: "codex";
        }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>>;
    }, z.core.$strict>;
    replyMode: z.ZodEnum<{
        assistant_changes: "assistant_changes";
        assistant_toolcalls_changes: "assistant_toolcalls_changes";
        summary_changes: "summary_changes";
        streaming_card: "streaming_card";
    }>;
}, z.core.$strict>;
export declare const botsConfigFileSchema: z.ZodObject<{
    version: z.ZodLiteral<3>;
    bots: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        provider: z.ZodEnum<{
            feishu: "feishu";
            lark: "lark";
            telegram: "telegram";
            webhook: "webhook";
            weixin: "weixin";
            discord: "discord";
            wecom: "wecom";
        }>;
        enabled: z.ZodBoolean;
        credentialRef: z.ZodOptional<z.ZodString>;
        webhookSecretRef: z.ZodOptional<z.ZodString>;
        webhookUrl: z.ZodOptional<z.ZodString>;
        webhookAuthHeaderName: z.ZodOptional<z.ZodString>;
        feishuAppId: z.ZodOptional<z.ZodString>;
        providerUserId: z.ZodOptional<z.ZodString>;
        displayName: z.ZodOptional<z.ZodString>;
        allowedWorkspaces: z.ZodArray<z.ZodString>;
        allowedCommands: z.ZodObject<{
            status: z.ZodBoolean;
            new: z.ZodBoolean;
            workspace: z.ZodBoolean;
            model: z.ZodBoolean;
            mode: z.ZodOptional<z.ZodBoolean>;
            thoughtLevel: z.ZodBoolean;
            sandboxMode: z.ZodOptional<z.ZodBoolean>;
            approvalPolicy: z.ZodOptional<z.ZodBoolean>;
            cli: z.ZodOptional<z.ZodBoolean>;
            reply: z.ZodBoolean;
        }, z.core.$strict>;
        currentOptions: z.ZodObject<{
            modelSelection: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            mode: z.ZodOptional<z.ZodString>;
            sandboxMode: z.ZodOptional<z.ZodString>;
            approvalPolicy: z.ZodOptional<z.ZodString>;
            cli: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
                claude: "claude";
                glm: "glm";
                opencode: "opencode";
                gemini: "gemini";
                codex: "codex";
            }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>>;
        }, z.core.$strict>;
        replyMode: z.ZodEnum<{
            assistant_changes: "assistant_changes";
            assistant_toolcalls_changes: "assistant_toolcalls_changes";
            summary_changes: "summary_changes";
            streaming_card: "streaming_card";
        }>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const botsStateFileSchema: z.ZodObject<{
    version: z.ZodLiteral<3>;
    bots: z.ZodRecord<z.ZodString, z.ZodObject<{
        botId: z.ZodString;
        group: z.ZodOptional<z.ZodObject<{
            chatId: z.ZodString;
            chatMode: z.ZodOptional<z.ZodEnum<{
                group: "group";
                topic: "topic";
            }>>;
            threadId: z.ZodOptional<z.ZodString>;
            rootMessageId: z.ZodOptional<z.ZodString>;
            topicTitle: z.ZodOptional<z.ZodString>;
            topicUrl: z.ZodOptional<z.ZodString>;
            historyEnabled: z.ZodOptional<z.ZodBoolean>;
            topicActive: z.ZodOptional<z.ZodBoolean>;
            preparation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
                }, z.core.$strict>]>>>;
                messageId: z.ZodString;
                senderName: z.ZodString;
                text: z.ZodString;
                status: z.ZodEnum<{
                    failed: "failed";
                    preparing: "preparing";
                    waitingStop: "waitingStop";
                }>;
                error: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>>;
            topicAliases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
                taskId: z.ZodString;
                rootMessageId: z.ZodString;
            }, z.core.$strict>>>;
            name: z.ZodString;
            ownerId: z.ZodString;
            enabled: z.ZodBoolean;
            taskIds: z.ZodArray<z.ZodString>;
            taskWorkspaces: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>>;
            currentOptions: z.ZodObject<{
                modelSelection: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                mode: z.ZodOptional<z.ZodString>;
                sandboxMode: z.ZodOptional<z.ZodString>;
                approvalPolicy: z.ZodOptional<z.ZodString>;
                cli: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
                    claude: "claude";
                    glm: "glm";
                    opencode: "opencode";
                    gemini: "gemini";
                    codex: "codex";
                }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>>;
            }, z.core.$strict>;
            initiatorId: z.ZodOptional<z.ZodString>;
            authorizationId: z.ZodOptional<z.ZodString>;
            deliveries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
                channelReplyRequestHash: z.ZodOptional<z.ZodString>;
                appId: z.ZodOptional<z.ZodString>;
                trace: z.ZodOptional<z.ZodObject<{
                    traceId: z.ZodOptional<z.ZodString>;
                    parentId: z.ZodOptional<z.ZodString>;
                    spanId: z.ZodOptional<z.ZodString>;
                    traceparent: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                authorizationId: z.ZodOptional<z.ZodString>;
                id: z.ZodString;
                taskId: z.ZodString;
                sourceCommandId: z.ZodOptional<z.ZodString>;
                text: z.ZodString;
                replyToMessageId: z.ZodOptional<z.ZodString>;
                mentionedUserIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
                contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
                }, z.core.$strict>]>>>;
                providerMessageId: z.ZodOptional<z.ZodString>;
                threadId: z.ZodOptional<z.ZodString>;
                rootMessageId: z.ZodOptional<z.ZodString>;
                status: z.ZodEnum<{
                    pending: "pending";
                    failed: "failed";
                    unknown: "unknown";
                    sent: "sent";
                    invalidated: "invalidated";
                }>;
                lastError: z.ZodOptional<z.ZodString>;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
            autoReplyGuard: z.ZodOptional<z.ZodObject<{
                consecutive: z.ZodNumber;
                messageIds: z.ZodArray<z.ZodString>;
            }, z.core.$strict>>;
            backgroundHistory: z.ZodOptional<z.ZodObject<{
                revision: z.ZodString;
                checkpoint: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            inputs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
                taskId: z.ZodString;
                source: z.ZodObject<{
                    botIdentity: z.ZodOptional<z.ZodObject<{
                        name: z.ZodString;
                        openId: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    appId: z.ZodOptional<z.ZodString>;
                    contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
                    }, z.core.$strict>]>>>;
                    authorizationId: z.ZodOptional<z.ZodString>;
                    botId: z.ZodString;
                    provider: z.ZodEnum<{
                        feishu: "feishu";
                        lark: "lark";
                    }>;
                    chatId: z.ZodString;
                    threadId: z.ZodOptional<z.ZodString>;
                    rootMessageId: z.ZodOptional<z.ZodString>;
                    senderId: z.ZodString;
                    senderName: z.ZodString;
                    mentionedBot: z.ZodOptional<z.ZodBoolean>;
                    messageId: z.ZodString;
                    messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
                        }, z.core.$strict>]>>>;
                        messageId: z.ZodString;
                        senderId: z.ZodString;
                        senderName: z.ZodString;
                        mentionedBot: z.ZodOptional<z.ZodBoolean>;
                        text: z.ZodString;
                        conversationQuotes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            text: z.ZodString;
                            path: z.ZodOptional<z.ZodString>;
                            senderName: z.ZodOptional<z.ZodString>;
                            senderId: z.ZodOptional<z.ZodString>;
                            messageId: z.ZodOptional<z.ZodString>;
                            sentAt: z.ZodOptional<z.ZodString>;
                        }, z.core.$strip>>>;
                        attachmentIndexes: z.ZodArray<z.ZodNumber>;
                    }, z.core.$strict>>>;
                    topicContext: z.ZodOptional<z.ZodObject<{
                        messages: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            chatId: z.ZodString;
                            threadId: z.ZodString;
                            senderId: z.ZodString;
                            senderName: z.ZodOptional<z.ZodString>;
                            parentId: z.ZodOptional<z.ZodString>;
                            attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                name: z.ZodString;
                                kind: z.ZodString;
                            }, z.core.$strict>>>;
                            senderType: z.ZodEnum<{
                                app: "app";
                                user: "user";
                            }>;
                            text: z.ZodString;
                            createdAt: z.ZodNumber;
                            kind: z.ZodString;
                            controlCard: z.ZodOptional<z.ZodBoolean>;
                            deleted: z.ZodOptional<z.ZodBoolean>;
                        }, z.core.$strict>>;
                        checkpoint: z.ZodString;
                        hasGap: z.ZodBoolean;
                    }, z.core.$strict>>;
                    topicHistory: z.ZodOptional<z.ZodObject<{
                        checkpoint: z.ZodString;
                        hasGap: z.ZodBoolean;
                        messageCount: z.ZodNumber;
                        resourceMessages: z.ZodArray<z.ZodObject<{
                            messageId: z.ZodString;
                            count: z.ZodNumber;
                        }, z.core.$strict>>;
                    }, z.core.$strict>>;
                }, z.core.$strict>;
                admission: z.ZodOptional<z.ZodEnum<{
                    pending: "pending";
                    accepted: "accepted";
                    rejected: "rejected";
                }>>;
                progress: z.ZodOptional<z.ZodObject<{
                    status: z.ZodEnum<{
                        failed: "failed";
                        done: "done";
                        cancelled: "cancelled";
                        stopped: "stopped";
                        waiting: "waiting";
                        discarded: "discarded";
                        working: "working";
                    }>;
                    interruptionReason: z.ZodOptional<z.ZodLiteral<"newMessage">>;
                    cardMessageId: z.ZodOptional<z.ZodString>;
                    cardStatus: z.ZodOptional<z.ZodEnum<{
                        failed: "failed";
                        done: "done";
                        cancelled: "cancelled";
                        stopped: "stopped";
                        waiting: "waiting";
                        discarded: "discarded";
                        working: "working";
                    }>>;
                }, z.core.$strict>>;
            }, z.core.$strict>>>;
        }, z.core.$strict>>;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        workspaceId: z.ZodOptional<z.ZodString>;
        mode: z.ZodEnum<{
            task: "task";
            draft: "draft";
        }>;
        activeTaskId: z.ZodNullable<z.ZodString>;
        draftOptions: z.ZodOptional<z.ZodObject<{
            provider: z.ZodPipe<z.ZodEnum<{
                claude: "claude";
                glm: "glm";
                opencode: "opencode";
                gemini: "gemini";
                codex: "codex";
            }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>;
            modelSelection: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            mode: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        pendingPermissionOptions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            requestId: z.ZodString;
            optionId: z.ZodString;
            command: z.ZodEnum<{
                deny: "deny";
                approve: "approve";
            }>;
            label: z.ZodString;
            response: z.ZodObject<{
                decision: z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    escalate: "escalate";
                    modify: "modify";
                }>;
                reason: z.ZodOptional<z.ZodString>;
                modifiedInput: z.ZodOptional<z.ZodUnknown>;
                permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    type: z.ZodLiteral<"addRules">;
                    behavior: z.ZodEnum<{
                        ask: "ask";
                        allow: "allow";
                        deny: "deny";
                    }>;
                    rules: z.ZodArray<z.ZodObject<{
                        toolName: z.ZodString;
                        ruleContent: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>>;
            }, z.core.$strict>;
            handledAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        pendingElicitation: z.ZodOptional<z.ZodObject<{
            taskId: z.ZodString;
            requestId: z.ZodString;
            runId: z.ZodString;
            origin: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"subagent">;
                agentId: z.ZodString;
                agentType: z.ZodString;
                childSessionId: z.ZodString;
                childTurnId: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                parentSessionId: z.ZodString;
                parentToolCallId: z.ZodOptional<z.ZodString>;
                parentTurnId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            actorKey: z.ZodOptional<z.ZodString>;
            currentQuestionIndex: z.ZodNumber;
            questions: z.ZodArray<z.ZodObject<{
                question: z.ZodString;
                header: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                multiSelect: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
            answers: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
            renderContext: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"plan_approval">;
                plan: z.ZodString;
            }, z.core.$strict>>;
            expandedCustomAnswerQuestionIndexes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            handledAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        telegramOffset: z.ZodOptional<z.ZodNumber>;
        weixinGetUpdatesBuf: z.ZodOptional<z.ZodString>;
        weixinActivatedAt: z.ZodOptional<z.ZodNumber>;
        privateBindingId: z.ZodOptional<z.ZodString>;
        privateRecipientId: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strict>;
export declare const DEFAULT_BOT_COMMANDS: BotAllowedCommands;
export declare const DEFAULT_BOT_REPLY_GRANULARITY: BotReplyGranularity;
export declare function getSupportedBotReplyGranularities(provider: BotProvider): readonly BotReplyGranularity[];
export declare function normalizeBotReplyGranularity(provider: BotProvider, replyMode: BotReplyGranularity | undefined): BotReplyGranularity;
export declare const BOT_ZCODE_PROVIDER_OPTIONS: Array<{
    id: ZCodeProvider;
    label: string;
}>;
//# sourceMappingURL=bots.d.ts.map