import type { BotOutboundMessage } from "@zcode/shared";
type ReplyTarget = Pick<BotOutboundMessage, "replyToMessageId" | "threadId" | "rootMessageId">;
/** 明确拒绝后的有限降级；话题不能误发到群主聊天，也不能重试同一失效锚点。 */
export declare function getUnavailableReplyFallback(target: ReplyTarget): ReplyTarget | null;
export {};
//# sourceMappingURL=groupReply.d.ts.map