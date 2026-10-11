import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
import type { TaskChatMessage } from "@/lib/taskChatMessageTypes.js";
/** 从 rows 窗口选出最后一个 assistant 轮，并适配为旧 TaskChatMessage 形态。 */
export declare function buildTreemappingMessageFromRows(rows: readonly ConversationRow[]): TaskChatMessage | null;
/**
 * 订阅指定 session 的 v4 conversation 投影，返回 Treemapping 需要的合成 assistant 消息。
 * sessionId 为空时不订阅，返回 null。
 */
export declare function useTreemappingConversationMessage(params: {
    sessionId: string | null;
    workspacePath: string;
    workspaceIdentity?: string;
}): TaskChatMessage | null;
//# sourceMappingURL=useTreemappingConversationMessage.d.ts.map