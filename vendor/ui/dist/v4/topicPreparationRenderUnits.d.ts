import type { BotTopicPreparation as Preparation } from "@zcode/shared";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
import type { ConversationTurnRenderUnit } from "@/v4/conversationTurnRenderUnits.js";
export declare function pendingTopicPreparations(items: readonly Preparation[], rows: readonly ConversationRow[]): {
    messageId: string;
    senderName: string;
    text: string;
    status: "failed" | "preparing" | "waitingStop";
    contentParts?: ({
        type: "text";
        text: string;
    } | {
        type: "channelMention";
        refId: string;
        name: string;
        channel: "feishu" | "lark";
        targetId: string;
        idType: "open_id";
        entityType: "unknown" | "user" | "bot";
    })[] | undefined;
    error?: string | undefined;
}[];
/** 准备消息进入现有轮次的消息流及测高/滚动链路；不伪造 CLI accepted row。 */
export declare function withTopicPreparationMessages(units: ConversationTurnRenderUnit[], rows: readonly ConversationRow[], items: readonly Preparation[]): ConversationTurnRenderUnit[];
//# sourceMappingURL=topicPreparationRenderUnits.d.ts.map