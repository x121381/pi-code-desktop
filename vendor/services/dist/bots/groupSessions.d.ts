import type { BotActor, BotContextState } from "@zcode/shared";
/** 群身份不能用发送者代替，否则多人会串到私聊或各自创建任务。 */
export declare function getBotConversationKey(actor: Pick<BotActor, "botId" | "chatType" | "chatId" | "threadId" | "conversationThreadId">): string;
export declare function getBotStateKey(context: BotContextState): string;
export declare function isGroupOwnerCommand(command: string): boolean;
export declare function canAnswerGroupQuestion(actorId: string, ownerId: string, initiatorId: string | undefined, isPlan: boolean): boolean;
//# sourceMappingURL=groupSessions.d.ts.map