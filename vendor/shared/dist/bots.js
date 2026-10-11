import { zcodeProtocolTraceSchema } from "./zcode-protocol/trace.js";
import { channelContentPartsSchema } from "./channel-mention.js";
/* oxlint-disable eslint(max-lines) -- Bot 共享合约集中维护 provider、状态和 schema，保持类型与校验就近。 */
import { z } from "zod";
import { modelSelectionSchema } from "./model-selection.js";
import { conversationQuotesSchema } from "./conversationSelection.js";
import { ZCODE_AGENT_PROVIDER, ZCODE_AGENT_PROVIDER_LABEL } from "./zcode-agent-policy.js";
import { zcodeInteractionRequestOriginSchema, zcodePermissionResponseSchema, } from "./zcode-protocol-legacy-types.js";
export const botProviders = [
    "telegram",
    "webhook",
    "feishu",
    "lark",
    "weixin",
    "discord",
    "wecom",
];
/**
 * 定时任务完成后的 Bot 回推目标。只保留未来仍稳定的会话地址；当前消息 id/context token
 * 属于一次入站交互，不能持久化后复用。该字段由 Host 注入，模型工具参数不直接暴露。
 */
export const zcodeAutomationBotDeliveryTargetSchema = z
    .object({
    provider: z.enum(["feishu", "lark", "weixin"]),
    botId: z.string().trim().min(1),
    providerUserId: z.string().trim().min(1),
    chatType: z.enum(["private", "group"]),
    threadId: z.string().min(1).optional(),
    rootMessageId: z.string().min(1).optional(),
})
    .strict();
export function isFeishuBotProvider(provider) {
    return provider === "feishu" || provider === "lark";
}
export const BOT_REPLY_GRANULARITIES = [
    "assistant_changes",
    "assistant_toolcalls_changes",
    "summary_changes",
    "streaming_card",
];
export const ALL_BOT_WORKSPACES = "*";
export const BOT_BIND_CODE_TTL_MS = 30_000;
export const botGroupDeliverySchema = z
    .object({
    /** 名字解析前的请求指纹；重复调用只读原回执，不因目录变化改发给其他人。 */
    channelReplyRequestHash: z
        .string()
        .regex(/^[a-f0-9]{64}$/u)
        .optional(),
    appId: z.string().optional(),
    trace: zcodeProtocolTraceSchema.optional(),
    authorizationId: z.string().optional(),
    id: z.string().min(1),
    taskId: z.string().min(1),
    sourceCommandId: z.string().min(1).optional(),
    text: z.string(),
    replyToMessageId: z.string().optional(),
    mentionedUserIds: z.array(z.string().min(1)).max(200).optional(),
    contentParts: channelContentPartsSchema.optional(),
    providerMessageId: z.string().optional(),
    threadId: z.string().min(1).optional(),
    rootMessageId: z.string().optional(),
    status: z.enum(["pending", "sent", "failed", "unknown", "invalidated"]),
    lastError: z.string().optional(),
    updatedAt: z.number(),
})
    .strict();
export const botGroupCardSchema = z
    .object({
    chatId: z.string().min(1),
    threadId: z.string().min(1).optional(),
    conversationThreadId: z.string().min(1).nullable().optional(),
    taskId: z.string().nullable(),
    authorizationId: z.string().min(1),
})
    .strict();
export const botTopicMessageSchema = z
    .object({
    id: z.string().min(1),
    chatId: z.string().min(1),
    threadId: z.string().min(1),
    senderId: z.string(),
    senderName: z.string().optional(),
    parentId: z.string().optional(),
    attachments: z.array(z.object({ name: z.string(), kind: z.string() }).strict()).optional(),
    senderType: z.enum(["user", "app"]),
    text: z.string(),
    createdAt: z.number(),
    kind: z.string(),
    controlCard: z.boolean().optional(),
    deleted: z.boolean().optional(),
})
    .strict();
export const botTopicContextSchema = z
    .object({
    messages: z.array(botTopicMessageSchema).max(201),
    checkpoint: z.string().min(1),
    hasGap: z.boolean(),
})
    .strict();
export const botIdentitySchema = z
    .object({ name: z.string().min(1), openId: z.string().min(1).optional() })
    .strict();
export const botBackgroundHistorySchema = z
    .object({ revision: z.string().min(1), checkpoint: z.string().min(1).optional() })
    .strict();
export const botAutoReplyGuardSchema = z
    .object({
    consecutive: z.number().int().min(0).max(5),
    messageIds: z.array(z.string().min(1)),
})
    .strict();
export const botGroupInputStatusSchema = z.enum([
    "waiting",
    "working",
    "done",
    "failed",
    "stopped",
    "cancelled",
    "discarded",
]);
export const botTopicPreparationSchema = z
    .object({
    contentParts: channelContentPartsSchema.optional(),
    messageId: z.string().min(1),
    senderName: z.string(),
    text: z.string(),
    status: z.enum(["preparing", "waitingStop", "failed"]),
    error: z.string().optional(),
})
    .strict();
export const botGroupInputProgressSchema = z
    .object({
    status: botGroupInputStatusSchema,
    interruptionReason: z.literal("newMessage").optional(),
    cardMessageId: z.string().min(1).optional(),
    cardStatus: botGroupInputStatusSchema.optional(),
})
    .strict();
/** CLI 只接收轻量材料索引；原文留在 Host 归档及文本附件。 */
export const botTopicHistorySourceSchema = z
    .object({
    checkpoint: z.string().min(1).max(256),
    hasGap: z.boolean(),
    messageCount: z.number().int().min(0).max(201),
    resourceMessages: z
        .array(z
        .object({
        messageId: z.string().min(1).max(256),
        count: z.number().int().min(1).max(1000),
    })
        .strict())
        .max(201),
})
    .strict();
export const botTopicInputMessageSchema = z
    .object({
    contentParts: channelContentPartsSchema.optional(),
    messageId: z.string().min(1),
    senderId: z.string().min(1),
    senderName: z.string(),
    mentionedBot: z.boolean().optional(),
    text: z.string(),
    conversationQuotes: conversationQuotesSchema.optional(),
    attachmentIndexes: z.array(z.number().int().nonnegative()),
})
    .strict();
/** 可信 Host 注入的输入来源；身份展示不能反向授予执行权限。 */
export const botGroupInputSourceSchema = z
    .object({
    botIdentity: botIdentitySchema.optional(),
    appId: z.string().min(1).optional(),
    contentParts: channelContentPartsSchema.optional(),
    authorizationId: z.string().min(1).optional(),
    botId: z.string().min(1),
    provider: z.enum(["feishu", "lark"]),
    chatId: z.string().min(1),
    threadId: z.string().min(1).optional(),
    rootMessageId: z.string().optional(),
    senderId: z.string().min(1),
    senderName: z.string(),
    mentionedBot: z.boolean().optional(),
    messageId: z.string().min(1),
    messages: z.array(botTopicInputMessageSchema).min(1).max(200).optional(),
    topicContext: botTopicContextSchema.optional(),
    topicHistory: botTopicHistorySourceSchema.optional(),
})
    .strict()
    .superRefine((source, ctx) => {
    if (source.messages &&
        (!source.threadId ||
            source.messages.at(-1)?.messageId !== source.messageId ||
            new Set(source.messages.map((message) => message.messageId)).size !==
                source.messages.length)) {
        ctx.addIssue({
            code: "custom",
            path: ["messages"],
            message: "Topic batch boundary mismatch",
        });
    }
    if (source.topicHistory &&
        (!source.threadId || source.topicHistory.checkpoint !== source.messageId)) {
        ctx.addIssue({
            code: "custom",
            path: ["topicHistory"],
            message: "Topic history scope mismatch",
        });
    }
    if (source.topicContext &&
        (!source.threadId ||
            source.topicContext.checkpoint !== source.messageId ||
            source.topicContext.messages.some((m) => m.chatId !== source.chatId || m.threadId !== source.threadId)))
        ctx.addIssue({
            code: "custom",
            path: ["topicContext"],
            message: "Topic context scope mismatch",
        });
});
export const BOT_TASK_BROADCAST_CHANNEL = "bots:task";
export const BOT_TASK_STREAM_BROADCAST_CHANNEL = "bots:task-stream";
export const botAllowedCommandsSchema = z
    .object({
    status: z.boolean(),
    new: z.boolean(),
    workspace: z.boolean(),
    model: z.boolean(),
    mode: z.boolean().optional(),
    thoughtLevel: z.boolean(),
    sandboxMode: z.boolean().optional(),
    approvalPolicy: z.boolean().optional(),
    // 兼容旧 bot-config.json；/cli 命令已移除，新配置不会再写入这个字段。
    cli: z.boolean().optional(),
    reply: z.boolean(),
})
    .strict();
export const botCommandPolicySchema = botAllowedCommandsSchema;
// 修复原因：第三方 CLI provider 已移除，ZCodeProvider 只剩 glm，但旧 bot 配置与状态文件里可能仍存有
// 已移除 provider 的历史值。改成严格 literal 会让整份文件 parse 失败、Bot 全部不可用；
// 因此解析时继续接受这些历史值，并统一归一到当前唯一的 agent provider。
const legacyBotAgentProviderSchema = z
    .enum(["codex", "claude", "opencode", "gemini", "glm"])
    .transform(() => ZCODE_AGENT_PROVIDER);
export const botCurrentOptionsSchema = z
    .object({
    modelSelection: modelSelectionSchema.optional(),
    mode: z.string().min(1).optional(),
    sandboxMode: z.string().min(1).optional(),
    approvalPolicy: z.string().min(1).optional(),
    // 兼容旧 bot-config.json；CLI provider 现在统一由 ZCode Protocol 侧配置决定。
    cli: legacyBotAgentProviderSchema.optional(),
})
    .strict();
export const botDraftOptionsSchema = z
    .object({
    provider: legacyBotAgentProviderSchema,
    modelSelection: modelSelectionSchema.optional(),
    mode: z.string().min(1).optional(),
})
    .strict();
const botElicitationOptionSchema = z
    .object({
    value: z.string(),
    label: z.string(),
    description: z.string().optional(),
})
    .strict();
const botElicitationQuestionSchema = z
    .object({
    question: z.string(),
    header: z.string(),
    options: z.array(botElicitationOptionSchema),
    multiSelect: z.boolean().optional(),
})
    .strict();
const botPendingElicitationSchema = z
    .object({
    taskId: z.string().min(1),
    requestId: z.string().min(1),
    runId: z.string().min(1),
    origin: zcodeInteractionRequestOriginSchema.optional(),
    actorKey: z.string().min(1).optional(),
    currentQuestionIndex: z.number().int().min(0),
    questions: z.array(botElicitationQuestionSchema),
    answers: z.record(z.string(), z.array(z.string())),
    renderContext: z
        .object({
        kind: z.literal("plan_approval"),
        plan: z.string().min(1),
    })
        .strict()
        .optional(),
    expandedCustomAnswerQuestionIndexes: z.array(z.number().int().min(0)).optional(),
    handledAt: z.number().optional(),
})
    .strict();
export const botConfigSchema = z
    .object({
    id: z.string().min(1),
    name: z.string(),
    provider: z.enum(botProviders),
    enabled: z.boolean(),
    credentialRef: z.string().min(1).optional(),
    webhookSecretRef: z.string().min(1).optional(),
    webhookUrl: z.string().url().optional(),
    webhookAuthHeaderName: z.string().min(1).optional(),
    feishuAppId: z.string().min(1).optional(),
    providerUserId: z.string().min(1).optional(),
    displayName: z.string().optional(),
    allowedWorkspaces: z.array(z.string().min(1)),
    allowedCommands: botAllowedCommandsSchema,
    currentOptions: botCurrentOptionsSchema,
    replyMode: z.enum([
        "assistant_changes",
        "assistant_toolcalls_changes",
        "summary_changes",
        "streaming_card",
    ]),
})
    .strict();
export const botsConfigFileSchema = z
    .object({
    version: z.literal(3),
    bots: z.array(botConfigSchema),
})
    .strict();
export const botsStateFileSchema = z
    .object({
    version: z.literal(3),
    bots: z.record(z.string(), z.object({
        botId: z.string().min(1),
        group: z
            .object({
            chatId: z.string().trim().min(1),
            chatMode: z.enum(["group", "topic"]).optional(),
            threadId: z.string().trim().min(1).optional(),
            rootMessageId: z.string().min(1).optional(),
            topicTitle: z.string().optional(),
            topicUrl: z.string().url().optional(),
            historyEnabled: z.boolean().optional(),
            topicActive: z.boolean().optional(),
            preparation: z.array(botTopicPreparationSchema).optional(),
            topicAliases: z
                .record(z.string(), z.object({ taskId: z.string().min(1), rootMessageId: z.string().min(1) }).strict())
                .optional(),
            name: z.string(),
            ownerId: z.string().min(1),
            enabled: z.boolean(),
            taskIds: z.array(z.string().min(1)),
            taskWorkspaces: z
                .record(z.string(), z
                .object({
                workspacePath: z.string().min(1),
                workspaceIdentity: z.string().optional(),
            })
                .strict())
                .optional(),
            currentOptions: botCurrentOptionsSchema,
            initiatorId: z.string().optional(),
            authorizationId: z.string().optional(),
            deliveries: z.record(z.string(), botGroupDeliverySchema).optional(),
            autoReplyGuard: botAutoReplyGuardSchema.optional(),
            backgroundHistory: botBackgroundHistorySchema.optional(),
            inputs: z
                .record(z.string(), z
                .object({
                taskId: z.string().min(1),
                source: botGroupInputSourceSchema,
                admission: z.enum(["pending", "accepted", "rejected"]).optional(),
                progress: botGroupInputProgressSchema.optional(),
            })
                .strict())
                .optional(),
        })
            .strict()
            .optional(),
        workspacePath: z.string().min(1),
        workspaceIdentity: z.string().min(1).optional(),
        workspaceId: z.string().min(1).optional(),
        mode: z.enum(["draft", "task"]),
        activeTaskId: z.string().min(1).nullable(),
        draftOptions: botDraftOptionsSchema.optional(),
        pendingPermissionOptions: z
            .array(z.object({
            requestId: z.string().min(1),
            optionId: z.string().min(1),
            command: z.enum(["approve", "deny"]),
            label: z.string().min(1),
            response: zcodePermissionResponseSchema,
            handledAt: z.number().optional(),
        }))
            .optional(),
        pendingElicitation: botPendingElicitationSchema.optional(),
        telegramOffset: z.number().optional(),
        weixinGetUpdatesBuf: z.string().optional(),
        weixinActivatedAt: z.number().optional(),
        privateBindingId: z.string().min(1).optional(),
        privateRecipientId: z.string().min(1).optional(),
        updatedAt: z.number(),
    })),
})
    .strict();
export const DEFAULT_BOT_COMMANDS = {
    status: true,
    new: true,
    workspace: true,
    model: true,
    mode: true,
    thoughtLevel: true,
    reply: true,
};
export const DEFAULT_BOT_REPLY_GRANULARITY = "assistant_changes";
export function getSupportedBotReplyGranularities(provider) {
    return isFeishuBotProvider(provider)
        ? ["streaming_card"]
        : BOT_REPLY_GRANULARITIES.filter(
        // Bugfix: streaming card 依赖 Feishu/Lark Card JSON 2.0，其他 channel 无法渲染或更新该消息形态。
        (granularity) => granularity !== "streaming_card");
}
export function normalizeBotReplyGranularity(provider, replyMode) {
    const supported = getSupportedBotReplyGranularities(provider);
    const candidate = replyMode ?? DEFAULT_BOT_REPLY_GRANULARITY;
    return supported.includes(candidate) ? candidate : supported[0];
}
export const BOT_ZCODE_PROVIDER_OPTIONS = [{ id: ZCODE_AGENT_PROVIDER, label: ZCODE_AGENT_PROVIDER_LABEL }];
//# sourceMappingURL=bots.js.map