import type { QueueItem } from "@zcode/shared/zcode-protocol-v4";
import type { ConversationRowRenderContext } from "@/v4/conversationRowContext.js";
interface ConversationPendingGuideListProps {
    context: ConversationRowRenderContext;
    items: readonly QueueItem[];
    turnId: string;
}
declare function ConversationPendingGuideListImpl({ context, items, turnId, }: ConversationPendingGuideListProps): import("react/jsx-runtime").JSX.Element | null;
export declare const ConversationPendingGuideList: import("react").MemoExoticComponent<typeof ConversationPendingGuideListImpl>;
export {};
//# sourceMappingURL=ConversationPendingGuideList.d.ts.map