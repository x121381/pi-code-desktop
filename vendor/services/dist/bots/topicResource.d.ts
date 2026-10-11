import type { BotConfig, BotInboundAttachment, BotsConfigFile, BotsStateFile, ZCodeProtocolTrace } from "@zcode/shared";
export interface TopicResourceRequest {
    taskId: string;
    inputId: string;
    messageId: string;
    authorizationId: string;
    workspacePath: string;
    workspaceIdentity?: string;
    resourceIndex?: number;
    signal?: AbortSignal;
    trace?: ZCodeProtocolTrace;
    remoteSessionId?: string;
}
export interface TopicResourceMessage {
    messageId: string;
    chatId: string;
    threadId: string;
    deleted?: boolean;
    attachments: BotInboundAttachment[];
}
export interface TopicResourceDependencies {
    readState(): Promise<BotsStateFile>;
    readConfig(): Promise<BotsConfigFile>;
    readMessage(bot: BotConfig, target: {
        messageId: string;
        chatId: string;
        threadId: string;
    }, signal?: AbortSignal): Promise<TopicResourceMessage>;
    download(bot: BotConfig, attachment: BotInboundAttachment, target: {
        messageId: string;
        chatId: string;
        threadId: string;
    }, signal?: AbortSignal): Promise<{
        attachment: BotInboundAttachment;
        data: Uint8Array;
    }>;
}
/** 历史附件此前只有文字占位；下载必须从已接收输入反查身份，不能相信模型提供的群信息。 */
export declare function readAuthorizedTopicResource(request: TopicResourceRequest, deps: TopicResourceDependencies): Promise<{
    attachment: BotInboundAttachment;
    data: Uint8Array;
}>;
export declare function authorizeTopicResource(request: TopicResourceRequest, deps: Pick<TopicResourceDependencies, "readState" | "readConfig">): Promise<{
    bot: BotConfig;
    target: {
        messageId: string;
        chatId: string;
        threadId: string;
    };
    identity: string;
}>;
//# sourceMappingURL=topicResource.d.ts.map