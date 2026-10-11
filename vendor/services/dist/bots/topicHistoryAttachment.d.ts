import type { BotTopicHistoryBatch, ZCodePromptFileAttachment } from "@zcode/shared";
/** 历史正文只写一份附件；服务端归档用于权限和检查点，不再生成模型隐藏消息。 */
export declare function createTopicHistoryAttachment(batch: BotTopicHistoryBatch, inputId: string, title: string): ZCodePromptFileAttachment | undefined;
export declare function botGroupCommandId(botId: string, chatId: string, messageId: string): string;
//# sourceMappingURL=topicHistoryAttachment.d.ts.map