import { type ChannelContentPart } from "@zcode/shared";
export declare function isFeishuBotSender(senderType: string): boolean;
/** 只接受真实 mention 身份，不能靠显示名或正文中的 @ 字样触发执行。 */
export declare function readGroupMessage(text: string, mentions: unknown, botOpenId: string, senderType: string, senderOpenId?: string): {
    text: string;
    commandText: string;
    mentionedBot: boolean;
    contentParts?: ChannelContentPart[];
} | null;
export declare function readGroupMentionText(text: string, mentions: unknown, botOpenId: string, senderType: string, senderOpenId?: string): string | null;
/** 只取卡片可见正文，不把按钮值和审批参数作为另一机器人的发言。 */
export declare function readGroupCardText(value: unknown): string;
/** interactive 也是普通回复载体；只根据控件结构识别操作卡片，不能按消息类型全拦。 */
export declare function isGroupControlCard(value: unknown): boolean;
/** 卡片正文中的发送端 ID 可能与接收端不同，使用平台有序 mentions 恢复本端身份。 */
export declare function readGroupConversationCardText(value: unknown, mentions: unknown): string;
//# sourceMappingURL=feishuGroupMessages.d.ts.map