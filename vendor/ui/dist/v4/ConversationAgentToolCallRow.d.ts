import type { ConversationAssistantWorkRenderItem } from "@/v4/conversationAssistantWorkItems.js";
import type { ConversationRowRenderContext } from "@/v4/conversationRowContext.js";
export declare function openSubagentSessionFromSummary({ backgrounded: _backgrounded, childSessionId, context, subagentType, title, }: {
    backgrounded?: boolean;
    childSessionId?: string;
    context: ConversationRowRenderContext;
    subagentType: string;
    title: string;
}): boolean;
export declare function ConversationAgentToolCallRow({ item, context, }: {
    item: Extract<ConversationAssistantWorkRenderItem, {
        kind: "agentToolCall";
    }>;
    context: ConversationRowRenderContext;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConversationAgentToolCallRow.d.ts.map